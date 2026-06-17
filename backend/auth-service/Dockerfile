# We only need the lightweight runtime, NO gradle compiler!
FROM eclipse-temurin:17-jre
WORKDIR /app

# Grabs the jar you already successfully built on your VM host
COPY auth-service/build/libs/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
