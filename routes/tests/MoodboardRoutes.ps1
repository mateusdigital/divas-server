
$SERVER    = "http://localhost:5000";
$CURL      = "curl";
$CURL_ARGS = "-is"


##
## GET
##

## -----------------------------------------------------------------------------
function Test_Start()
{
  $function_name = (Get-PSCallStack)[1].FunctionName;
  Write-Output "[$function_name] ----------------------";
}

function Test_End()
{
  $function_name = (Get-PSCallStack)[1].FunctionName;
  Write-Output "`n---------------------- [$function_name] ";
  Write-Output "`n";
}

##
## GET
##

## -----------------------------------------------------------------------------
function GetAll()
{
  Test_Start;
  & "$CURL" "${CURL_ARGS}" "${SERVER}/moodboard";
  Test_End;
}

## -----------------------------------------------------------------------------
function GetWithId()
{
  Test_Start;
  $id = $args[0];
  & "$CURL" "${CURL_ARGS}" "${SERVER}/moodboard/$id";
  Test_End;
}


## -----------------------------------------------------------------------------
function GetWithMultipleIds()
{
  Test_Start;
    $ids = $args | ConvertTo-Json;
    & "$CURL" "${CURL_ARGS}"                `
        -X POST                             `
        -H "Content-Type: application/json" `
        -d "{`"ids`": $ids}"                `
      "${SERVER}/moodboard/ids/"            ;

  Test_End;
}


## -----------------------------------------------------------------------------
GetAll;

GetWithId "6627f79b35ed4e0ae3c09ab1";

GetWithMultipleIds           `
  "6627f79b35ed4e0ae3c09ab1" `
  "6627f79b35ed4e0ae3c09ab1";
