FROM gradle:8.5-jdk17 AS build
WORKDIR /workspace
COPY . .
RUN gradle :report-service:bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/report-service/build/libs/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
