import sys
import time
import pywhatkit as kit
import pandas as pd
import pyautogui

def send_whatsapp_messages(csv_path, message):
    df = pd.read_csv(csv_path)

    for index, row in df.iterrows():
        name = row['name']
        phone = row['phone']
        formatted_phone = "+91" + str(phone).strip()  # Change country code if needed

        try:
            print(f"Sending to {name}: {formatted_phone}")
            kit.sendwhatmsg_instantly(formatted_phone, message, wait_time=10, tab_close=True)
            time.sleep(5)  # Wait for the message box to appear
            pyautogui.press("enter")  # Send the message
            time.sleep(1)  # Pause before the next message
        except Exception as e:
            print(f"Failed for {name}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python send_bulk_whatsapp.py contacts.csv 'Your message here'")
        sys.exit(1)

    csv_file = sys.argv[1]
    message_text = sys.argv[2]

    send_whatsapp_messages(csv_file, message_text)



# import pywhatkit as pwk
# import pyautogui
# import time

# phone_number = '+919692963362'
# message = "Hello, this is a test message from Python!"

# pwk.sendwhatmsg_instantly(phone_number, message)
# # Wait for WhatsApp Web to load
# time.sleep(10)  # Adjust if needed

# # Simulate pressing Enter to send the message
# pyautogui.press("enter")