import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Shopify products sync...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user's ID from the authorization header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user's JWT claims to verify their identity
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('Invalid authorization');
    }

    console.log('Authenticated user:', user.id);

    // Get the seller's profile with Shopify credentials
    const { data: sellerProfile, error: sellerError } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (sellerError || !sellerProfile) {
      console.error('Seller profile error:', sellerError);
      throw new Error('Seller profile not found');
    }

    if (!sellerProfile.shopify_enabled || !sellerProfile.shopify_settings?.store_name) {
      throw new Error('Shopify integration not configured');
    }

    const storeName = sellerProfile.shopify_settings.store_name;
    const accessToken = sellerProfile.shopify_app_secret;

    if (!accessToken) {
      throw new Error('Shopify access token not found');
    }

    console.log('Fetching products from Shopify store:', storeName);

    // Fetch products from Shopify
    const shopifyResponse = await fetch(
      `https://${storeName}.myshopify.com/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text();
      console.error('Shopify API error:', errorText);
      throw new Error(`Failed to fetch Shopify products: ${shopifyResponse.status} ${errorText}`);
    }

    const shopifyData = await shopifyResponse.json();
    console.log('Fetched Shopify products:', shopifyData.products.length);

    // Process each product and upsert to our database
    const productsToUpsert = shopifyData.products.map((product: any) => ({
      name: product.title,
      description: product.body_html,
      price: product.variants[0]?.price || 0,
      sku: product.variants[0]?.sku,
      shopify_id: product.id.toString(),
      shopify_variant_id: product.variants[0]?.id.toString(),
      shopify_data: product,
      seller_id: sellerProfile.id,
      active: true,
    }));

    console.log('Upserting products to database:', productsToUpsert.length);

    const { error: upsertError } = await supabase
      .from('products')
      .upsert(productsToUpsert, {
        onConflict: 'shopify_id,seller_id',
      });

    if (upsertError) {
      console.error('Error upserting products:', upsertError);
      throw new Error('Failed to sync products with database');
    }

    console.log('Products sync completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${productsToUpsert.length} products` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in sync-shopify-products function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});