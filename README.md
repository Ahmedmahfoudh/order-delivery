# Order Delivery Application

## Project Description

The Order Delivery Application is a comprehensive web-based system for managing the entire order delivery process, from inventory management to payment processing. The application provides a seamless interface for tracking orders, managing inventory, working with suppliers, and processing payments.

### Key Features

- **Inventory Management**: Track product stock levels, update quantities, and monitor low stock items
- **Supplier Management**: View and manage supplier orders and relationships
- **Order Tracking**: Real-time tracking of order status and delivery progress
- **Payment Processing**: Handle various payment methods and track payment statuses

## Technologies Used

### Backend
- **Java 17**
- **Spring Boot 2.7.x**: Core framework
- **Spring Data JPA**: Data access and persistence
- **Spring Web**: RESTful API development
- **MySQL**: Database
- **Lombok**: Reduces boilerplate code
- **H2 Database**: For development and testing

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Material UI**: Component library for consistent design
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for frontend deployment

## Installation and Setup

### Prerequisites
- Docker and Docker Compose
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/order-delivery-application.git
   cd order-delivery-application
   ```

2. Run the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api

### Manual Development Setup

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd order-delivery-backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd order-delivery-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The backend provides a RESTful API with the following main endpoints:

- `/api/products`: Manage products and inventory
- `/api/suppliers`: Manage suppliers
- `/api/orders`: Manage orders
- `/api/tracking`: Track order delivery status
- `/api/payments`: Process and manage payments

## Project Structure

### Backend Structure
```
src/main/java/com/example/orderdelivery/
├── controller/       # REST API controllers
├── entity/           # JPA entities
├── repository/       # Data access layer
├── service/          # Business logic
├── dto/              # Data transfer objects
└── config/           # Application configuration
```

### Frontend Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── services/         # API service layer
├── hooks/            # Custom React hooks
└── utils/            # Utility functions
```

## Future Improvements

- Implement user authentication and authorization
- Add reporting and analytics features
- Enhance mobile responsiveness
- Implement real-time notifications
- Add unit and integration tests

## Contributors

Ahmed Mahfoudh
