# Login

Used to collect a Token for a registered User.

**URL** : `/token`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "username": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "email": "foo@bar.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.XXz--LjIepejxvconULjb_VuprHiQ2lu6SeXQJRi2Ns"
}
```

## Error Response

**Condition** : If 'email' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "message": "Unauthorized"
}
```

## Example
```bash
$ curl -X POST http://localhost:3000/token -d 'email=john@mail.com&password=john123'
```
### Important

This is a real example, because all users are mocked

### User mocked list
* { id: "1", name: "John", email: "john@mail.com", password: "john123" }
* { id: "2", name: "Sarah", email: "sarah@mail.com", password: "sarah123" }
