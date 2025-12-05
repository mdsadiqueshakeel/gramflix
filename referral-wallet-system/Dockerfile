# # Stage 1: Build the backend
# FROM maven:3.8.7-eclipse-temurin-17 AS build

# # Set working directory
# WORKDIR /app

# # Copy Maven config first for caching
# COPY pom.xml mvnw ./
# COPY .mvn .mvn

# # Download dependencies without building
# RUN mvn -B -ntp dependency:go-offline

# # Copy source code
# COPY src ./src

# # Package the app (skip tests)
# RUN mvn -B -ntp package -DskipTests

# # Stage 2: Run the backend
# FROM eclipse-temurin:17-jre

# WORKDIR /app

# # Copy jar from build stage
# COPY --from=build /app/target/*.jar app.jar

# # Java options (adjust memory if needed)
# ENV JAVA_OPTS="-Xms256m -Xmx512m"

# # Expose port
# EXPOSE 8080

# # Run the app
# ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]


FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
