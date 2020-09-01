port module Main exposing (main)

import ElmHtml.InternalTypes exposing (decodeElmHtml)
import ElmHtml.ToString exposing (FormatOptions, defaultFormatOptions, nodeToStringWithOptions)
import Html exposing (Html)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Platform



-- MAIN


main : Program () Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    ()


init : () -> ( Model, Cmd Msg )
init _ =
    ( ()
    , Http.get
        { url = "https://jsonip.com"
        , expect =
            Http.expectJson GotIp
                (Decode.field
                    "ip"
                    Decode.string
                )
        }
    )



-- UPDATE


type Msg
    = GotIp (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        GotIp result ->
            case result of
                Ok ipAddress ->
                    ( (), htmlOut (viewRenderer ipAddress) )

                Err _ ->
                    ( (), htmlOut (viewRenderer "Error!") )



-- PORTS


port htmlOut : String -> Cmd msg



-- VIEW RENDERING


viewRenderer : String -> String
viewRenderer text =
    let
        options =
            { defaultFormatOptions | newLines = False, indent = 0 }
    in
    viewDecoder options (view text)


viewDecoder : FormatOptions -> Html msg -> String
viewDecoder options viewHtml =
    case
        Decode.decodeValue
            (decodeElmHtml
                (\_ _ ->
                    Decode.succeed ()
                )
            )
            (asJsonView
                viewHtml
            )
    of
        Ok str ->
            nodeToStringWithOptions options str

        Err err ->
            "Error: " ++ Decode.errorToString err


asJsonView : Html msg -> Decode.Value
asJsonView x =
    Encode.string "REPLACE_ME_WITH_JSON_STRINGIFY"


view : String -> Html msg
view text =
    Html.div [] [ Html.text text ]
