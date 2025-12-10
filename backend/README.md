## Installation
1. ```npm install -g pnpm``` <br />
Tõmbab pnpm package, mida tuleb kasutada projekti package'ite installimiseks. Tee seda kui sa ei ole veel seda teinud.

2. ```pnpm i``` <br />
Seda peab tegema, et saaks ilma liigsete failideta installida projekti package'id.

3. Installi ja sätti enda arvutis tööle mysql server.

4. ```CREATE DATABASE hindamine_db;``` <br />
Loob tühja 'hindamine_db' andmebaasi mysql serveris.

5. 'backend/' kaustas loo '.env' fail. Template:
```
DB_NAME=hindamine_db
DB_USER=root
DB_PASSWORD={sinu root parool}
DB_HOST=localhost
DB_PORT=3306
PORT=3000
# Optional: email verification
EMAIL_FROM="OpetajateRate <no-reply@yourdomain.ee>"
SMTP_HOST=smtp.yourdomain.ee
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
# Frontend base URL used in verification links
APP_BASE_URL=http://localhost:5173
```

## Usage
1. ```pnpm dev``` <br />
Käivitab backend serveri.

## Tests
- Automated testing with jest:
    1. ```pnpm test``` <br />
    Käivitab automaatse testimise 'tests/' kaustas asuvatele testidele.
    <br />
    
- Manual testing:
    1. Kasuta 'Postman' või 'Thunder Client'<br />
    2. Test 1 - Loo kasutaja:
        - Request: ```POST```
        - URL: ```http://localhost:3000/api/auth/register```
        - Body & json: <br />
        ```
        {
            "name": "Test Kasutaja",
            "email": "kasutaja@test.ee",
            "password": "salasona123"
        }
        ```
    3. Samm 2 - Loo õpetaja:
        - Request: ```POST```
        - URL: ```http://localhost:3000/api/teachers```
        - Body & json: <br />
        ```
        {
            "name": "Õpetaja Lauri",
            "description": "Matemaatika"
        }
        ```
    4. Samm 3 - Hinda õpetajat (Ärireegli test):
        - Request: ```POST```
        - URL: ```http://localhost:3000/api/ratings```
        - Body & json: <br />
        ```
        {
            "teacherId": 1,
            "userId": 1,
            "rating": 5,
            "description": "Väga hea tund!"
        }
        ```
    5. Samm 4 - Kontrolli tulemust:
        - Request: ```GET```
        - URL: ```http://localhost:3000/api/teachers/1```

## API Documentation
| Meetod | Endpoint | Kirjeldus |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Loo uus kasutaja |
| `POST` | `/api/auth/login` | Logi sisse |
| `GET` | `/api/teachers` | Küsi kõiki õpetajaid |
| `GET` | `/api/teachers/:id` | Küsi ühte õpetajat (koos keskmise hindega) |
| `POST` | `/api/teachers` | Lisa uus õpetaja |
| `POST` | `/api/ratings` | Lisa hinnang (vallandab keskmise arvutuse) |
| `GET` | `/api/teachers/:id/ratings` | Küsi konkreetse õpetaja hindeid |