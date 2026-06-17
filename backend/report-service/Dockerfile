FROM eclipse-temurin:17-jre
WORKDIR /app

# Copies the jar compiled on the host VM
COPY report-service/build/libs/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
