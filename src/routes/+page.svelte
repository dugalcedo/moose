<!-- 
    Ideas...
        - First of all, the defineHandler function in the server lib. This is the keystone of the whole library. Inferred types come from here, which help us make requests and forms with ease.
        - The main appeal of defineHandler should be the fact that you never have to deal with response objects or try/catch blocks. You either return or throw. That's it.
        - The second biggest appeal (for typescript users) is the ability to infer the input type and output type, then use it on the front end.
            -- Other more minor appeals:
                --- automatic zod error handling
                --- easy to use jwt-helper
        - Then, we want to showcase the request function, how you can define a request and get useful states in a similar fashion to tanstack query. But don't mention tanstack query. (maybe say "libraries you may be already familiar with"). We want to highlight for the typescript users that they can use the inferred types with it.
        - We also want to showcase the defineForm function. How it can also be used with the inferred types and allows us to manage form validation, error states, etc in an easier way.
        - Then we want to show off the Field component trio. Field, FieldError, FieldHint. We want the user to know that it's minimalistic and doesn't force any CSS on them. They are free to style it however they want. They should also know that FieldError and FieldHint are completely optional--they can handle hints and errors however they like. In fact, they don't even have to use the Field component.
    Philosophies, pitches, soundbytes, selling points, etc...
        - It's not a UI library!
        - It's minimal!
        - It's flexible!
        - Unopinionated!
        - Compatible!
-->