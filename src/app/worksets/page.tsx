export default function WorksetsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Worksets</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          Create Workset
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            <div className="font-semibold">ID</div>
            <div className="font-semibold">Name</div>
            <div className="font-semibold">Status</div>
            <div className="font-semibold">Actions</div>
          </div>
        </div>
        <div className="p-4 text-center text-gray-500">
          No worksets found
        </div>
      </div>
    </div>
  );
} 