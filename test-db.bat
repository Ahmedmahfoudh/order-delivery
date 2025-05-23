@echo off
echo Testing MySQL connection...

REM Try to connect to MySQL
echo Attempting to connect to MySQL on port 3308...
mysql -u root -p -h localhost -P 3308 -e "SHOW DATABASES;"

echo.
echo If you see a list of databases above, your connection is working.
echo If you see an error, please check your MySQL credentials.
echo.
pause
