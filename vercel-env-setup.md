# Vercel Environment Variables Setup

To fix the deployment error on Vercel, you need to add the following environment variables to your Vercel project:

## Required Environment Variables

```
# Firebase Admin SDK
FIREBASE_PROJECT_ID=wapi-40b90
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@wapi-40b90.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1q4QNKOE63MgG\npzVx/CtIpD9cgVu8YOTBS5OwkKUymyBk/ct0TccNOokGE47/HTA9O5q+pog80180\nUOzmsgNXFRVf91j0Ebg+n9BMFwKoc/rLKolKWfQ0Yr6ii5XqM6vK96HWLlOgAqnU\nY09REdfHlUJugPc3eRsTKe7dQw+0nlSQ58VOHNwj6oZQ5R7zYLPqsn5lvwftkcc2\nUiYe4qSapR5ffP/QmitsiBqwfuf5qTp5XfbmP0Sbgc6CkG7D3GUpIhPMqggC1CQM\n+7oUf3NzokOc30+nivqHhdmP3Z9qbkYj/W/PiYNDJp8/xtiy5EP3rQ7EnM4EeuiD\nb8gLMAr3AgMBAAECggEANrDLQLDxWSiVGRemacm5+BTmNEGHLedXhm9rp0hsSxdT\nQcP7x2gQyAU6sfcaYefWGWEDvWhh9DnH2/aO0wZ9Je6lcC4E+/kHp+axrO5ycOb1\ndcs46Ia7Ezg03rc56vciPSiecl2g9DdJDDTXcHb4KE/hX2X4xpzxTywdCkRBiqRr\nsz/9AAQ1FgDZwgBgISagT8/a3lndDs3oTSoL2BH7fZ3cFMsI4UWiLN3uAXwxktZg\nFBEAaaS86COs7b2PXD21VLK1SyUY+d23FogIg8weQu9DEdbPpDk69nHj8s2POEhE\naz6EDuk3bjasXQyoV2Ftfvqs0Y1BV5lUhQ7c5HH0pQKBgQDe6Ivpi4gf8NfqDgfV\nYoU90sYakmogeIK6nzeKLHMVUeZ+YeNXF9JFg7cupLr/L09YFqjrK6nZVRdLCWON\ncvCdXhZai9uWmThlH1nXGUxnyzXykdwaIftfMZFe8WoOFYIE5aPylTfCVqAhEGSB\ngVDvL7WGf14aWShCvkwxi7htcwKBgQDQo7yyolqJ6q7o6MsUv66457Kj4gKqqI1v\ng7UiW8/gQaYjPFrNtFfSrFr9TEiH9d12oZ/UxpctM69UBeazbKLCig66QrprlkYn\nUBoQqD0lbTI3/76vjJ8NO3ylK2kdmvijKbgpMw/+8PLbU6goGudhrGlHMgikDHLb\nj7oXXdSLbQKBgQCYvYoZluXI1TRuCf0uJ1sbmNDsJkWYSFtz22OoR3r4Me2ZziOE\naytHPNEJohEMiPN6bdSDiKDS7i6O2TkhFJBxlKYGl2z5TbZJ/GiILqqfOKyXsYC7\nW2uut/1frFa6ndxA1MY5lCvn+4mv/laQMvctXmipZ58ouM0Qpur4zD+spwKBgCXK\nsuBslhfLQbmAiWCNw/lMRsh2pOMCuvPLGKFLniDR42UYhp4iH5JSk/yzt6Og/meB\nqTDic/nFFeoTU5GGiQjR9w74DUp1oul2EfKYdtLzr5gDJCgqQZklAFPuxBCPxJ/R\na8FStYAJZwQhaCEzllvT3hH+VyBX/OoWY6/d2CUVAoGALrbblxFm3/EGphtyERU8\nCbIMWEJ+ztPvzT/aHoe2C0aZF/+B8V4LLX4zORloquXmbmg2fIyoejJqnPRUgqBv\naEdjiIlXcQvBw57JdaTN0yOKebw0Ay15tRz+waxzWnu7T7H4Uikd1SSP/3gzyLBx\nkYJYzmV4QztaiR3DZe4Mvl4=\n-----END PRIVATE KEY-----\n"

# Google AI SDK (for Gemini)
GOOGLE_API_KEY=your_google_api_key_here

# Other environment variables your app might need
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wapi-40b90.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wapi-40b90
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wapi-40b90.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
```

## Steps to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings" tab
4. Go to "Environment Variables" section
5. Add each variable one by one
6. Make sure to include the quotes around the FIREBASE_PRIVATE_KEY value
7. After adding all variables, redeploy your application

## Important Notes

- The FIREBASE_PRIVATE_KEY must include the quotes and all \n characters exactly as shown
- You may need to add other environment variables depending on your application's requirements
- After adding these variables, trigger a new deployment
