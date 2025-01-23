import { OrderForm } from "@/components/admin/OrderForm";

const CreateOrder = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Order</h1>
      </div>
      <OrderForm />
    </div>
  );
};

export default CreateOrder;