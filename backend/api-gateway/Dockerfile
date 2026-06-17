FROM eclipse-temurin:17-jre
WORKDIR /app

# Copies the jar compiled on the host VM
COPY api-gateway/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
