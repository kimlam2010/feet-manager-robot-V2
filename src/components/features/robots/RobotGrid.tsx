import { useRouter } from 'next/navigation';
import { Robot, RobotStatus, HealthStatus } from '@/types/robot';
import { useRobots } from '@/hooks/useRobots';

export function RobotGrid() {
  const router = useRouter();
  const { data: robots = [], isLoading, error } = useRobots();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-red-500">Error loading robots</p>
      </div>
    );
  }

  if (robots.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No robots found</p>
      </div>
    );
  }

  const getStatusColor = (status: RobotStatus) => {
    const colors = {
      ONLINE: 'bg-green-100 text-green-800',
      OFFLINE: 'bg-gray-100 text-gray-800',
      BUSY: 'bg-yellow-100 text-yellow-800',
      ERROR: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-blue-100 text-blue-800',
    };
    return colors[status];
  };

  const getHealthColor = (health: HealthStatus) => {
    const colors = {
      GOOD: 'bg-green-100 text-green-800',
      WARNING: 'bg-yellow-100 text-yellow-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    return colors[health];
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {robots.map((robot) => (
        <div
          key={robot.id}
          onClick={() => router.push(`/robots/${robot.id}`)}
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{robot.name}</h3>
              <p className="text-sm text-gray-500">{robot.serialNumber}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                robot.status
              )}`}
            >
              {robot.status}
            </span>
          </div>

          <div className="space-y-3">
            {/* Battery Level */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Battery</span>
                <span>{robot.batteryLevel}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBatteryColor(robot.batteryLevel)}`}
                  style={{ width: `${robot.batteryLevel}%` }}
                />
              </div>
            </div>

            {/* Health Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Health</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getHealthColor(
                  robot.healthStatus
                )}`}
              >
                {robot.healthStatus}
              </span>
            </div>

            {/* Location & Last Active */}
            <div className="text-sm text-gray-500">
              <p>{robot.location || 'No location'}</p>
              <p>
                Last active:{' '}
                {robot.lastActive
                  ? new Date(robot.lastActive).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 