import tkinter as tk
from tkinter import messagebox

def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    if y == 0:
        return "Error: Division by zero is not allowed."
    return x / y

def evaluate_expression(expression):
    try:
        result = eval(expression)
        return result
    except ZeroDivisionError:
        return "Error: Division by zero is not allowed."
    except Exception as e:
        return f"Error: {str(e)}"

def on_button_click(event):
    current_text = display.get()
    button_text = event.widget.cget("text")

    if button_text == "=":
        result = evaluate_expression(current_text)
        display.delete(0, tk.END)
        display.insert(tk.END, result)
    elif button_text == "C":
        display.delete(0, tk.END)
    else:
        display.insert(tk.END, button_text)

def close_app():
    root.destroy()

# Create the main window
root = tk.Tk()
root.title("Calculator")
root.configure(bg="#333333")

# Remove window decorations
root.overrideredirect(True)

# Create the close button
close_button = tk.Button(root, text="X", font=("Arial", 12, "bold"), command=close_app, bg="#ff3333", fg="#ffffff")
close_button.grid(row=0, column=3, sticky="e", padx=5, pady=5)

# Create the display
display = tk.Entry(root, font=("Arial", 18), borderwidth=2, relief="solid", justify='right', bg="#ffffff", fg="#000000")
display.grid(row=1, column=0, columnspan=4, padx=5, pady=5)

# Create the buttons
buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "C"
]

button_colors = {
    "/": "#ff3333",
    "*": "#ff3333",
    "-": "#ff3333",
    "+": "#ff3333",
    "=": "#66ff66",
    "C": "#ffcc66"
}

row_val = 2
col_val = 0

for button_text in buttons:
    color = button_colors.get(button_text, "#f0f0f0")
    font = ("Arial", 14, "bold") if button_text in ["/", "*", "-", "+"] else ("Arial", 14)
    button = tk.Button(root, text=button_text, font=font, width=4, height=2, bg=color, fg="#000000")
    button.grid(row=row_val, column=col_val, padx=3, pady=3)
    button.bind("<Button-1>", on_button_click)
    col_val += 1
    if col_val > 3:
        col_val = 0
        row_val += 1

# Run the main loop
root.mainloop()

