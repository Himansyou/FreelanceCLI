FROM gradle:8.5-jdk17 AS build
WORKDIR /workspace
COPY . .
RUN gradle :api-gateway:bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/api-gateway/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
