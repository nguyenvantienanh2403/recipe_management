[**Content and Run**]<br>
Source code available at github.com, through the following link:<br>
[https://github.com/danielpm1982/quarkus-recipe-catalog](https://github.com/danielpm1982/quarkus-recipe-catalog)<br>

After cloning this project, configuring a project module at your IDE (e.g. IDEA IntelliJ) that points out to your GraalVM installation (e.g. graalvm-jdk-21.0.8+12.1), and from the root folder of this app, at your console...

For building and running the app using the traditional jvm Maven Profile (default):

1. Firstly, comment in all package imports and their uses at the code regarding org.graalvm.polyglot extension - as this is considered when using the classic jvm Profile. This dependency is totally supported and compatible when using jvm Profile. Also, comment out any DBMS extension at pom.xml (including H2), except for PostgreSQL. Comment in the line at application.properties that sets the kind of datasource to postgresql. If you wanna connect the app with a real DB (at Production), also set its url manually (Quarkus won't use Dev Services or Testcontainers, if you do that).
2. Building:<br>
   ./mvnw -Pjvm clean package<br>
   or<br>
   ./mvnw clean package
3. Running:<br>
   ./mvnw quarkus:dev<br>
   (this runs the mvn profile jvm in "dev" mode, either with H2 or PostgreSQL)<br>
   or<br>
   ./mvnw quarkus:run<br>
   (this runs the mvn profile jvm in "production" mode, either with H2 or PostgreSQL)<br>
   or<br>
   java -jar ./target/quarkus-app/quarkus-run.jar<br>
   (running the built jar directly with "java -jar" only works if you're running H2 DBMS, or if you have already started manually your PostgreSQL DBMS with the DB - it won't start Testcontainers automatically, differently from if you start the app by using Quarkus plugin, as above - which are preferable)

If running on the "dev" mode, you can visualize quarkus dev UI at:<br>
http://localhost:8080/q/dev-ui <br>
If running either on the "dev" or "production" modes, you can visualize Swagger-UI interface at (you can also disable it for production at application.properties file):<br>
http://localhost:8080/q/dev-ui/quarkus-smallrye-openapi/swagger-ui <br>
If running either on the "dev" or "production" modes, you can also visualize the following traceability endpoints, as well (you gotta have already started JAEGER UI container manually as above described):<br>
http://localhost:16686/search <br>
http://localhost:8080/q/metrics <br>

For building and running the app using the native Maven Profile (always on "production" mode - there's no "dev" mode here):

1. Firstly, comment out all package imports and their uses at the code regarding org.graalvm.polyglot extension - as this is only considered when using the classic jvm Profile. This dependency is not supported or compatible when using native-image Profile. Also, as there is no Dev Services or Testcontainers at native images, you gotta create and start the DBMS/DB manually. If you wanna use H2, comment in its extension at the pom.xml and its props at application.properties (comment out all props for PostgreSQL). Conversely, if you wanna use PostgreSQL, comment in its extension at pom.xml and its kind of datasource at the application.properties (comment out all props for H2).
2. Building:<br>
   ./mvnw -Pnative clean package<br>
   or<br>
   ./mvnw -Dnative clean package<br>
3. Running:<br>
   ./target/quarkus-recipe-catalog-1.0.0-SNAPSHOT-runner<br>
   (this is a standalone executable native image which can be shared anywhere else, for running natively at similar-architecture machines - does not depend on JVMs or Java)<br>
   or<br>
   java -jar ./target/quarkus-recipe-catalog-1.0.0-SNAPSHOT-native-image-source-jar/quarkus-recipe-catalog-1.0.0-SNAPSHOT-runner.jar <br>
   (both running cases above only work if you're running H2 DBMS, or if you have already started manually your PostgreSQL DBMS with the DB - running a native image or its corresponding running jar won't start Testcontainers automatically. DBMS containers are not in-built at native images - only in the case of H2)

More about Quarkus and GraalVM at:<br>
https://quarkus.io and https://www.graalvm.org .

[**Printscreen samples**]<br>

![graalvm-polyglot-code.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/graalvm-polyglot-code.png)

![dev-ui.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/dev-ui.png)

![health-check.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/health-check.png)

![swagger-ui.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/swagger-ui.png)

![java+python-output.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/java%2Bpython-output.png)

![recipes-output.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/recipes-output.png)

![secure-endpoint-call.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/secure-endpoint-call.png)

![secure-endpoint-call2.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/secure-endpoint-call2.png)

![authenticate-token.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/authenticate-token.png)

![dev-services-postgresql.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/dev-services-postgresql.png)

![dev-services-postgresql2.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/dev-services-postgresql2.png)

![jaeger.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger.png)

![jaeger2.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger2.png)

![jaeger3.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger3.png)

![jaeger4.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger4.png)

![jaeger-request.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger-request.png)

![jaeger-connection.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger-connection.png)

![jaeger-sql.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/jaeger-sql.png)

![micrometer-prometheus.png](https://raw.githubusercontent.com/danielpm1982/quarkus-recipe-catalog/refs/heads/master/img/micrometer-prometheus.png)

Bước 1 — Cài PostgreSQL local
Tải tại: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
Chọn PostgreSQL 16, Windows x86-64 → Next liên tục với cấu hình:

Password: postgres
Port: 5432
Bỏ tick Stack Builder ở bước cuối → Finish

Bước 2 — Tạo database
Mở PowerShell, chạy:
powershell& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE recipecatalogdb;"
Nhập password postgres khi được hỏi.
Kiểm tra tạo thành công:
powershell& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "\l"
Phải thấy recipecatalogdb trong danh sách.

Bước 3 — Sửa application.properties
Mở file src/main/resources/application.properties, thay toàn bộ nội dung bằng:
properties# PostgreSQL local (Dev Services disabled vì có URL cụ thể)
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/recipecatalogdb
quarkus.datasource.username=postgres
quarkus.datasource.password=postgres

# SQL bootstrap

quarkus.hibernate-orm.sql-load-script=import.sql
quarkus.hibernate-orm.schema-management.strategy=drop-and-create

# JWT

mp.jwt.verify.publickey.location=publicKey.pem
mp.jwt.verify.issuer=https://danielpm1982.com
quarkus.native.resources.includes=publicKey.pem
smallrye.jwt.sign.key.location=privateKey.pem

# OpenTelemetry JDBC

quarkus.datasource.jdbc.telemetry=true

# Swagger luôn hiển thị

quarkus.swagger-ui.always-include=true

⚠️ Khi quarkus.datasource.jdbc.url được set cụ thể → Quarkus tự động tắt Dev Services → không cần Docker nữa.

Bước 4 — Xóa target cũ và chạy lại
powershellcd C:\Users\PC\Desktop\Windows\Hoc_tap\Ki_6\LTJavaNangCao\KTHP\quarkus-recipe-catalog

rmdir /s /q target

.\mvnw.cmd quarkus:dev

Bước 5 — Kết quả mong đợi
Console sẽ hiện:
INFO [io.quarkus] Quarkus 3.27.0 on JVM started in x.xxxs.
INFO [io.quarkus] Listening on: http://localhost:8080
Sau đó mở browser kiểm tra:
http://localhost:8080/q/health
http://localhost:8080/q/dev-ui
http://localhost:8080/q/dev-ui/quarkus-smallrye-openapi/swagger-ui

Nếu psql.exe không tìm thấy ở đường dẫn trên
powershell# Tìm psql.exe ở đâu
Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object FullName
Dùng đường dẫn tìm được thay vào lệnh ở Bước 2.
