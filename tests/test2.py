import asyncio
import websockets

async def test_voice_ws():
    uri = "ws://localhost:8000/voice?chat_id=1234"

    async with websockets.connect(uri) as websocket:

        with open("test.wav", "rb") as f:
            audio_data = f.read()

      
        chunk_size = 4096
        for i in range(0, len(audio_data), chunk_size):
            await websocket.send(audio_data[i:i+chunk_size])

        await websocket.send("END")
        try:
            async for message in websocket:
                print(message,end="")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")

asyncio.run(test_voice_ws())
