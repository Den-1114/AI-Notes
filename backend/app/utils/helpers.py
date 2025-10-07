from colorama import Fore, Style
import uuid


def debug_print(message: list):
    print(f"{Fore.GREEN}[DEBUG]{Style.RESET_ALL} {' '.join(map(str, message))}")


def error_print(message: list):
    print(f"{Fore.RED}[ERROR]{Style.RESET_ALL} {' '.join(map(str, message))}")


def generate_uid() -> str:
    return str(uuid.uuid4())


def allowed_file(filename: str, allowed_extensions: set) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions
