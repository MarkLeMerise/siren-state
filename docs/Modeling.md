# Modeling
> Defining and relating the parts of your object graph

### The base `SirenModel`
Siren State exports a `SirenModel` base class. In order to properly each

---

### Marking a domain model for Siren consumption
In Siren, the `class` is used to describe the "nature" of an entity. Siren State uses the `class` to correlate domain models with Siren entities.

For example, by declaring
```javascript
@SirenModel()
class Person extends SirenModel {}
```
you are telling Siren State that any entity received with a `person` class should be transformed into a `Person` object.

From the example above, the two requirements of Siren "registration" are laid out:
1. A model must be annoated with the `@SirenModel` annotation
2. A model must extend `SirenModel` so that entities are properly merged

In some cases you may not want to use the name of the domain class (e.g. `Person` => `person`). You may override this behavior by specifying a `sirenClass` property in the configuration for `@SirenModel`.

```javascript
@SirenModel({ sirenClass: 'my-siren-person' })
class Person extends SirenModel {}
```
Now, when Siren State encounters an entity with class `my-siren-person`, it will transform it into a `Person` object.


> 👆 Though Siren allows multiple classes, APIs are generally made simpler by only assigning a single class to an entity. Furthermore, Siren State will only use the first `class` to match to a registered `SirenModel`.

---

### Defining relationships
In Siren, entities are related to each by including "sub-entities" and giving them "rel" (relationship) labels. For example, imagine a `person`
entity with a list of `pet` subentities:

```json
{
    "class": ["person"],
    "links": [{
        "href": "/api/person/1",
        "rel": ["self"]
    }],
    "entities": [
        {
            "class": ["animal"],
            "links": [{
                "href": "/api/pets/fluffy",
                "rel": ["self"]
            }],
            "properties": {
                "name": "Yan",
                "type": "CAT"
            },
            "rel": ["pet"]
        }
    ],
    "properties": {
        "id": 1,
        "name": "Luiza"
    }
}
```

Using the `subentities` configuration option in the `@SirenModel` annotation, we can specify that `Person` _depends_ on `Animal`:

```javascript
@SirenModel()
class Animal extends SirenModel {}

@SirenModel({ subentities: { pet: Animal } })
class Person extends SirenModel {}
```
Now Siren State will call `Person.onUpdate` any time an `animal` entity is received.

---

### Transforming Properties
Often, a Siren property is formatted in a way that was convenient for server serialization, but might not be the best for client-side consumption.

### How it works
Imagine you have a `Person` domain model:

```typescript
interface PersonPojo {
    public age: number;
    public name: string;
    public nationality: Nationality;
}
```

And receive corresponding entities (with a `person` class) from a Siren API:

```json
{
    "class": ["person"],
    "links": [{
        "href": "/api/person/1",
        "rel": ["self"]
    }],
    "properties": {
        "age": 27,
        "id": 1,
        "name": "Luiza",
        "nationality": "BR"
    }
}
```

Using the `@SirenModel` annotation, we can tie these two together:

```typescript
interface PersonPojo {
    age: number;
    name: string;
    nationality: Nationality;
}

@SirenModel()
class Person extends SirenModel<PersonPojo> { ... }
```

This annotation will automatically "register" any entity with a `person` class and transform it into a `Person` class. The annotation can also take a configuration parameter to specify a custom Siren class (by default it "kebab cases" the class name) and dependencies on other classes:

```typescript
@SirenModel({
    sirenClass: 'my-person'
    subentities: {
        friends: FriendList
    }
})
class Person extends SirenModel<PersonPojo> {}
```

Now, entities with
