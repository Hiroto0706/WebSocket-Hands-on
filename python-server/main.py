from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import asyncio
import logging
from starlette.websockets import WebSocketState

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("websocket_server")


@app.get("/")
async def get():
    return HTMLResponse("<h1>WebSocket Server is running</h1>")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("クライアントが接続されました")

    logger.info("こことおってる？")
    logger.info(websocket.application_state)

    try:
        send_task = asyncio.create_task(send_messages_periodically(websocket))

        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message from client: {data}")

    except WebSocketDisconnect:
        logger.warning("クライアントが切断されました")
    except Exception as e:
        logger.error(f"エラーが発生しました: {e}")
    finally:
        send_task.cancel()
        await websocket.close()
        logger.info("WebSocket接続が終了しました")


async def send_messages_periodically(websocket: WebSocket):
    for i in range(100):
        if websocket.application_state != WebSocketState.CONNECTED:
            break
        await websocket.send_text(f"test text No.{i}")
        await asyncio.sleep(0.05)
