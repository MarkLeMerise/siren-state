# Modeling
> Defining and relating the parts of your object graph

### Quick start
```typescript
import { Siren, SirenModel } from 'siren-state';

interface IPerson {
    age: number;
    name: string;
    driversLicenseId?: string;
}

@Siren()
class Person extends SirenModel<IPerson> {}
```
At a minimum, domain models must:

1. Extend `SirenModel`, which allows entity reconciliation from a Siren API
1. Be `@Siren` annotated, configuring the model with the `siren-state` framework

### Advanced Configuration
#### Custom Siren `class`
By default the `@Siren` annotation will use a kebab-cased version of the domain class name to match on incoming Siren entities (e.g. `OrderList` will match `order-list`). Though recommended to follow this convention, it can be overridden using the `sirenClass` configuration:

```typescript
@Siren({ sirenClass: 'my-siren-person' })
class Person extends SirenModel<IPerson> {}
```
> 👆 The Siren spec allows multiple classes, but APIs are made simpler by assigning a single class to an entity. `siren-state` will only match on the first `class`.

#### Defining relationships
In Siren, entities are related to each by including "sub-entities" and giving them "rel" (relationship) labels. For example, imagine a `person`
Siren entity with a `pet` subentity:

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
                "href": "/api/person/1/pets/yan",
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

Using the `subentities` configuration option in the `@Siren` annotation, we can specify that `Person` _contains_ an `Animal`:

```typescript
import Animal from './Animal';

@Siren({ subentities: { pet: Animal } })
class Person extends SirenModel {}
```

By defining this relationship, `Person` will know to update when any new `Animal` entity is reconciled into the application state.

### Extending `SirenModel`


#### Property Transformation
####
