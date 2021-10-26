import uvicorn
from fastapi import FastAPI
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware
import model
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="public")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get('/draw')
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
@app.get('/')
def get_name():
    return {'Welcome': 'Hello World,its siraj'}


@app.post('/predict')
def predict_Anime(data: str = Body(...)):
    prediction = model.predict(data)

    return {
        'prediction': prediction,
    }


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)

#run in terminal
# uvicorn app:app --reload
