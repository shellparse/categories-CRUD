# categories microservice

a micro service to create categories and its connected entities Locales,Settings,Media,Locks

---

- To **CREATE** a category :
use end point : `POST:/api/create` and send along the request body as json
if request successful 
then you will get the created category object as json response
otherwise an error response

#### all properties marked with * are mandatory during creation
all none mandatory are nullable

**Example:**
```
{
    * "slug":"category",//string
    // locale field is optional but if you are sending an array of locales
    then fields marked with * must be provided:
    
     "locale":[{
        *"language_iso":"en",//string
        *"title":"my title",//string
        "seo_title":"my seo title",//string
        *"summary":"my summary", //string
        "seo_summary":"my seo summary",// string
        *"description":"my description",//string
        "seo_description":"my seo description",//string
        *"specify_seo_values":true // boolean
    }],
     "media":{
        "icon":"media icon",//string
        "portrait":["portrait1","portrait2"],// array of strings
        "landscape":["landscape1","landscape2"],// array of strings
        "square":["square1","square2"]// array of strings
    },
     *"settings":{
        *"is_premium":true,//boolean
        "excluded_domains":["domain1","domain2"],//array of strings
        "excluded_countries_iso":["ar","ak"],//array of strings
        "excluded_network_endpoints":[1,2,3],//array of numbers
        *"age_rating":"17"//string
    },
     "locks":{
        "is_locked_for_editing":"true",//string
        "current_editor":"mido",//string
        "is_locked_for_moderation_process":"locked",//string
        "is_locked_for_backend_process":"backend",//string
        "current_backend_process":"process"//string
    },
     "parent_id":"the parent",//string
     "ancestor_ids":["our ancestors","other ancestors"],// array of strings
     "product":"our awesome product",//string
     "path":"URI",//string
    * "is_indexed":true,//boolean
    // date should follow DD-MM-YYYY format
     "published_at":"06-06-2022",//string will be stored as date object
     "created_at":"01-06-2022",//string will be stored as date object
     "updated_at":"07-06-2022"//string will be stored as date object
}
```

#### all optional fields will be filled with null if wasn't provided 

---

- To **RETRIEVE** a category use slug name since all categories are unique
simply send a `GET:/api/category/:slug`

on success the category document as json response will be returned otherwise 
error response

---

- To **EDIT** a category send `PATCH:/api/category/:slug` with a json body of the fields that needs updating
following the same structure of every field in the create operation 

**Example:**
```
"media":{
        "icon":"new media icon",
        "portrait":["new portrait1"," new portrait2"],
        "landscape":["new landscape1","new landscape2"],
        "square":["new square1","square2"]
    }
```

- To **DELETE** a category send `DELETE:/api/category/:slug` and if the category slug was found it will be deleted
  and a copy of the category will be returned as json response otherwise error message