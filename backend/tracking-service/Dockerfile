FROM eclipse-temurin:17-jre
WORKDIR /app

# Copies the jar compiled on the host VM
COPY tracking-service/build/libs/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
