@echo off
echo Starting Order Delivery Backend Application...

REM Set Java and Maven environment
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set MAVEN_OPTS=-Xmx512m

REM Create database if it doesn't exist
echo Creating database if it doesn't exist...
mysql -u root -pahmed123. -h localhost -P 3308 -e "CREATE DATABASE IF NOT EXISTS order_delivery_db;"

REM Run Spring Boot application
echo Running Spring Boot application...
call mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8080"

echo Application started successfully!
