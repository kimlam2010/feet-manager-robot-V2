export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Robots</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Active Worksets</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <p className="text-3xl font-bold text-green-500">Online</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Alerts</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
} 