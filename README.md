# Piano Module

Configure AWS Account

    aws configure

    Access Key ID: AKIAJSPBUGGMSKUB6DJA
    Secret Access Key: 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
    Region Name: ap-southeast-1

Create THING

    THING=`aws iot create-thing --thing-name "piano-chip"`
    THINGARN=`echo $THING | jq '.thingArn' | sed 's/\"//g'`
    echo Created Thing $THINGARN

Output

    THINGARN=arn:aws:iot:ap-southeast-1:623790533772:thing/piano-chip


Create Device Policy    

    POLICY=`aws iot create-policy --policy-name "piano-chip-policy" --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"iot:*","Resource":"*"}]}'`
    POLICYARN=`echo $POLICY | jq '.policyArn' | sed 's/\"//g'`
    echo Created Policy $POLICYARN

Output

    POLICYARN=arn:aws:iot:ap-southeast-1:623790533772:policy/piano-chip-policy

Create Device Policy

    CERTIFICATE=`aws iot create-keys-and-certificate --set-as-active --certificate-pem-outfile certificate.pem.crt --public-key-outfile public.pem.key --private-key-outfile private.pem.key`
    CERTIFICATEARN=`echo $CERTIFICATE | jq '.certificateArn' | sed 's/\"//g'`
    echo Created certificate $CERTIFICATEARN

Output

    CERTIFICATEARN=arn:aws:iot:ap-southeast-1:623790533772:cert/0f39a02ec66063abbfd20e71db70ba889c090ced2291d8ab065a69f5f7d66a62

Attaching certificate and policy    

    aws iot attach-thing-principal --thing-name "piano-chip" --principal $CERTIFICATEARN
    aws iot attach-principal-policy --policy-name "piano-chip-policy" --principal $CERTIFICATEARN
