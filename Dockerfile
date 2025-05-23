FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the Maven POM file
COPY pom.xml .

# Download all required dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# For the runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
