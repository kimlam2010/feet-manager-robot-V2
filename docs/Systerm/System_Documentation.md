# Tài liệu kỹ thuật hệ thống Feet Robot Manager V2

## Mục lục
1. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
2. [Thành phần hệ thống](#thành-phần-hệ-thống)
3. [Kiến trúc phần mềm](#kiến-trúc-phần-mềm)
4. [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)
5. [API và giao thức](#api-và-giao-thức)
6. [Bảo mật](#bảo-mật)
7. [Khả năng mở rộng](#khả-năng-mở-rộng)
8. [Yêu cầu phần cứng](#yêu-cầu-phần-cứng)
9. [Triển khai và cấu hình](#triển-khai-và-cấu-hình)
10. [Quy trình phát triển và kiểm thử](#quy-trình-phát-triển-và-kiểm-thử)

## Tổng quan kiến trúc

Feet Robot Manager V2 được thiết kế theo mô hình kiến trúc đơn giản nhưng hiệu quả, tập trung vào quản lý quy mô nhỏ với tối đa 3 Workset và 20 robot. Hệ thống cho phép người dùng điều khiển, giám sát và lập lịch nhiệm vụ cho robot từ xa thông qua Internet.

### Sơ đồ kiến trúc tổng thể

```mermaid
graph TD
    subgraph "Client Layer"
        A[Web Application] 
        B[Mobile App]
        C[Third-party Systems]
    end
    
    subgraph "Server Layer"
        D[API Server]
        E[Authentication Service]
        F[Business Logic]
        G[Task Scheduler]
        H[Monitoring Service]
    end
    
    subgraph "Data Layer"
        I[(Database)]
        J[(File Storage)]
    end
    
    subgraph "Communication Layer"
        K[MQTT/WebSocket Service/gRPC]
    end
    
    A & B & C --> D
    D --> E & F & G & H
    E & F & G & H --> I & J
    F & G & H --> K
    K --> L[Robot 1]
    K --> M[Robot 2]
    K --> N[Robot n (max 20)]
```

### Tổng quan luồng dữ liệu

```mermaid
sequenceDiagram
    participant Client as Web/Mobile Client
    participant Server as Server Layer
    participant DB as Database
    participant Comm as MQTT/WebSocket/gRPC
    participant Robot as Robot Fleet

    Client->>Server: Request với API Key/Token
    Server->>Server: Xác thực và phân quyền
    Server->>DB: Truy vấn/Lưu trữ dữ liệu
    DB->>Server: Trả về kết quả
    
    alt Command to Robot
        Server->>Comm: Gửi lệnh điều khiển
        Comm->>Robot: Điều khiển robot
        Robot->>Comm: Phản hồi trạng thái
        Comm->>Server: Cập nhật trạng thái
    end
    
    Server->>Client: Trả về response
    
    loop Monitoring
        Robot->>Comm: Gửi dữ liệu trạng thái
        Comm->>Server: Cập nhật trạng thái
        Server->>DB: Lưu dữ liệu
        Server->>Client: Cập nhật giao diện
    end
```

## Thành phần hệ thống

### 1. Frontend

#### Công nghệ sử dụng:
- **Web Application**: React.js, Redux, Material-UI
- **Mobile Application**: React Native
- **Đồ họa bản đồ**: Canvas 2D, Leaflet.js (2D đơn giản)

#### Thành phần chính:
- **Dashboard**: Hiển thị tổng quan về trạng thái robot và hệ thống
- **Robot Control Interface**: Giao diện điều khiển robot đơn giản
- **Map Editor**: Công cụ tạo và chỉnh sửa bản đồ 2D
- **Task Scheduler**: Giao diện lập lịch và quản lý nhiệm vụ
- **User Management**: Quản lý người dùng và phân quyền cơ bản

### 2. Backend Services

Hệ thống backend được thiết kế đơn giản, phù hợp với quy mô nhỏ:

| Service | Chức năng chính | Công nghệ |
|---------|-----------------|-----------|
| API Server | Xử lý request và điều hướng | Node.js, Express |
| Authentication | Xác thực và phân quyền | JWT, Passport.js |
| Business Logic | Xử lý logic nghiệp vụ | Node.js |
| Task Scheduler | Quản lý và lập lịch nhiệm vụ | Node-cron |
| MQTT/WebSocket/gRPC | Giao tiếp với robot | MQTT.js, Socket.io, gRPC |
| Monitoring | Theo dõi trạng thái robot | Node.js, Express |

### 3. Cơ sở dữ liệu

Với quy mô nhỏ, hệ thống sử dụng cấu trúc đơn giản:

- **PostgreSQL**: Cơ sở dữ liệu chính, lưu trữ dữ liệu người dùng, cấu hình, workset, và robot
- **SQLite**: Bộ đệm cục bộ cho ứng dụng mobile nếu mất kết nối
- **File System**: Lưu trữ bản đồ, hình ảnh, và tệp cấu hình

### 4. Robot Communication Layer

- **Giao thức**: MQTT, WebSocket, gRPC
- **Bảo mật**: TLS, xác thực username/password hoặc certificate
- **Xử lý lỗi**: Auto-reconnect, message queuing đơn giản
- **Kết nối**: Hỗ trợ đồng thời tối đa 20 robot

## Kiến trúc phần mềm

### Mô hình phân lớp

```mermaid
graph TD
    A[Client] --> B[API Layer]
    
    subgraph "Server Architecture"
        B --> C[Controller Layer]
        C --> D[Service Layer]
        D --> E[Data Access Layer] 
        E --> F[Database]
    end
    
    subgraph "Robot Control"
        D --> G[MQTT/WebSocket/gRPC]
        G --> H[Robot Firmware]
    end
```

### Design Patterns được sử dụng

| Pattern | Ứng dụng | Mục đích |
|---------|----------|----------|
| MVC | Cấu trúc ứng dụng | Tách biệt giao diện, logic và dữ liệu |
| Repository | Data Access Layer | Trừu tượng hóa truy cập dữ liệu |
| Observer | Cập nhật trạng thái | Thông báo thay đổi trạng thái robot |
| Command | Điều khiển robot | Đóng gói lệnh điều khiển |
| Singleton | Kết nối DB & MQTT | Tái sử dụng kết nối |
| Factory | Tạo đối tượng | Khởi tạo đối tượng theo loại |

## Cơ sở dữ liệu

### Mô hình dữ liệu

Mô hình dữ liệu đơn giản phù hợp với hệ thống nhỏ:

```mermaid
erDiagram
    USERS ||--o{ WORKSET : creates
    USERS }|--|| USER_ROLES : has
    WORKSET ||--o{ ROBOT : contains
    WORKSET ||--o{ MAP : contains
    WORKSET ||--o{ TASK : contains
    ROBOT }|--|| ROBOT_STATUS : has
    TASK ||--o{ SCHEDULE : has
    
    USERS {
        int id PK
        string username
        string password_hash
        string email
        timestamp created_at
        bool is_active
    }
    
    USER_ROLES {
        int id PK
        int user_id FK
        string role
    }
    
    WORKSET {
        int id PK
        string name
        string description
        int owner_id FK
        timestamp created_at
    }
    
    ROBOT {
        int id PK
        string name
        int workset_id FK
        string robot_type
        string serial_number
        string activation_code
        json configuration
    }
    
    ROBOT_STATUS {
        int id PK
        int robot_id FK
        string status
        float battery_level
        json position
        timestamp last_update
    }
    
    TASK {
        int id PK
        string name
        int workset_id FK
        json definition
        timestamp created_at
    }
    
    SCHEDULE {
        int id PK
        int task_id FK
        string schedule_type
        string cron_expression
        bool is_active
    }
    
    MAP {
        int id PK
        string name
        int workset_id FK
        string file_path
        float resolution
    }
```

### Lược đồ quan hệ

Với quy mô nhỏ, không cần phân vùng phức tạp. Chỉ cần đánh index hiệu quả:

- Index trên các khóa chính (PK)
- Index trên các khóa ngoại (FK)
- Index trên các trường thường xuyên truy vấn
- Index trên các trường sắp xếp

## API và giao thức

### REST API

- **Authentication**:
  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/auth/refresh
  - POST /api/auth/logout

- **User Management**:
  - GET /api/users
  - POST /api/users
  - GET /api/users/:id
  - PUT /api/users/:id
  - DELETE /api/users/:id

- **Workset Management**:
  - GET /api/worksets
  - POST /api/worksets
  - GET /api/worksets/:id
  - PUT /api/worksets/:id
  - DELETE /api/worksets/:id

- **Robot Management**:
  - GET /api/robots
  - POST /api/robots
  - GET /api/robots/:id
  - PUT /api/robots/:id
  - DELETE /api/robots/:id
  - POST /api/robots/:id/control

- **Task Management**:
  - GET /api/tasks
  - POST /api/tasks
  - GET /api/tasks/:id
  - PUT /api/tasks/:id
  - DELETE /api/tasks/:id

- **Map Management**:
  - GET /api/maps
  - POST /api/maps
  - GET /api/maps/:id
  - PUT /api/maps/:id
  - DELETE /api/maps/:id

### WebSocket API

- **Connection**:
  - ws://host:port/ws
  - wss://host:port/ws (secure)

- **Events**:
  - robot.status: Cập nhật trạng thái robot
  - robot.position: Cập nhật vị trí robot
  - robot.battery: Cập nhật mức pin
  - robot.error: Thông báo lỗi
  - system.alert: Thông báo hệ thống

### MQTT Topics

- **Robot Control**:
  - feet/robot/{id}/control
  - feet/robot/{id}/command

- **Robot Status**:
  - feet/robot/{id}/status
  - feet/robot/{id}/position
  - feet/robot/{id}/battery
  - feet/robot/{id}/error

- **System**:
  - feet/system/status
  - feet/system/alert

### gRPC Services

- **RobotService**:
  - Control(ControlRequest) returns (ControlResponse)
  - GetStatus(StatusRequest) returns (StatusResponse)
  - StreamStatus(StatusRequest) returns (stream StatusResponse)

- **TaskService**:
  - CreateTask(TaskRequest) returns (TaskResponse)
  - UpdateTask(TaskRequest) returns (TaskResponse)
  - DeleteTask(TaskRequest) returns (TaskResponse)
  - GetTask(TaskRequest) returns (TaskResponse)
  - ListTasks(TaskRequest) returns (stream TaskResponse)

## Bảo mật

### Authentication

- JWT-based authentication
- Token refresh mechanism
- Session management
- Rate limiting
- IP blocking

### Authorization

- Role-based access control (RBAC)
- Permission-based access control (PBAC)
- Resource-based access control
- API key management

### Data Protection

- TLS/SSL encryption
- Data encryption at rest
- Secure password storage
- Secure API communication
- Secure file storage

### Robot Security

- Secure robot authentication
- Secure robot communication
- Secure robot firmware
- Secure robot configuration
- Secure robot data

## Khả năng mở rộng

### Horizontal Scaling

- Load balancing
- Database sharding
- Cache distribution
- Message queue
- Service discovery

### Vertical Scaling

- Resource optimization
- Performance tuning
- Memory management
- CPU optimization
- Storage optimization

### Microservices

- Service decomposition
- Service communication
- Service discovery
- Service monitoring
- Service deployment

## Yêu cầu phần cứng

### Server Requirements

- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- Network: 1Gbps
- OS: Ubuntu 20.04 LTS

### Client Requirements

- Web Browser: Chrome, Firefox, Safari, Edge
- Mobile OS: Android 8.0+, iOS 12.0+
- Network: 10Mbps
- Display: 1280x720 minimum

### Robot Requirements

- CPU: 1 core
- RAM: 1GB
- Storage: 16GB
- Network: WiFi/4G
- OS: Custom Linux

## Triển khai và cấu hình

### Deployment

- Docker containers
- Kubernetes cluster
- CI/CD pipeline
- Monitoring stack
- Logging stack

### Configuration

- Environment variables
- Configuration files
- Database configuration
- Network configuration
- Security configuration

### Monitoring

- System monitoring
- Application monitoring
- Database monitoring
- Network monitoring
- Security monitoring

### Logging

- Application logs
- System logs
- Security logs
- Audit logs
- Error logs

## Quy trình phát triển và kiểm thử

### Development Process

- Git workflow
- Code review
- Continuous integration
- Continuous deployment
- Documentation

### Testing Process

- Unit testing
- Integration testing
- System testing
- Performance testing
- Security testing

### Quality Assurance

- Code quality
- Performance quality
- Security quality
- Documentation quality
- User experience quality

---

## Phụ lục

### A. Ví dụ API Request/Response

**Request:**
```http
GET /api/robots/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": 1,
  "name": "Lab Assistant 1",
  "status": "online",
  "battery": 78,
  "position": {"x": 45.2, "y": 12.8},
  "lastActive": "2023-06-15T14:22:33Z",
  "worksetId": 1
}
```

### B. Cấu trúc bản đồ 2D đơn giản

Bản đồ 2D sử dụng định dạng GeoJSON đơn giản:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"type": "wall"},
      "geometry": {
        "type": "LineString",
        "coordinates": [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]
      }
    },
    {
      "type": "Feature",
      "properties": {"type": "obstacle", "name": "Table"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[2, 2], [5, 2], [5, 4], [2, 4], [2, 2]]]
      }
    },
    {
      "type": "Feature",
      "properties": {"type": "path"},
      "geometry": {
        "type": "LineString",
        "coordinates": [[1, 1], [8, 1], [8, 8], [1, 8]]
      }
    }
  ]
}
```

### C. Quy trình backup và khôi phục

- **Database**: Backup hàng ngày với pg_dump
- **File Storage**: Backup hàng tuần
- **Configuration**: Lưu trữ trong git repository
- **Khôi phục**: Script tự động để phục hồi dữ liệu

---

© 2023 Feet Robot Manager V2. Mọi quyền được bảo lưu.
