# CEP

GET street, district, city and state from given CEP

**URL** : `/cep/:cep`

**Method** : `GET`

**Auth required** : YES

* **Header**: `Authorization: Bearer <ACCESS_TOKEN>`

## Success Response

**Code** : `200 OK`

**Content examples**

For a valid CEP 90220010

```json
{
    "rua": "Rua Santo Antônio",
    "bairro": "Floresta",
    "cidade": "Porto Alegre",
    "estado": "RS"
}
```
## Error Response

**Condition** : If CEP dont exist invalid.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "message": "CEP Inválido"
}
```

## Example
```bash
$ curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/cep/90220010
```
