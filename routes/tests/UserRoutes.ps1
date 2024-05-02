
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
    & "$CURL" "${CURL_ARGS}" "${SERVER}/users";
  Test_End;
}

## -----------------------------------------------------------------------------
function GetWithId()
{
  Test_Start;
  $id = $args[0];
    & "$CURL" "${CURL_ARGS}" "${SERVER}/users/$id";
  Test_End;
}

## -----------------------------------------------------------------------------
function GetWithUserName()
{
  Test_Start;
  $username = $args[0];
    & "$CURL" "${CURL_ARGS}" "${SERVER}/user/$username";
  Test_End;
}



## -----------------------------------------------------------------------------
GetAll;

GetWithId "6510921f0ee3652230f41334";
GetWithUsername "matt-test";
