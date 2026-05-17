# Build stage: use Gradle to build the service
FROM gradle:8.5-jdk17 AS build
WORKDIR /workspace
COPY . .
RUN gradle :auth-service:bootJar --no-daemon

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/auth-service/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
