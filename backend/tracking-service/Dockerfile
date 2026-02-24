FROM gradle:8.5-jdk17 AS build
WORKDIR /workspace
COPY . .
RUN gradle :tracking-service:bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/tracking-service/build/libs/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
