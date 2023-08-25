import eel
import eel_layer.base_eel_func
from utils.general import get_static_web_server_dir

if __name__ == '__main__':
    eel.init(get_static_web_server_dir())
    eel.start('html/main.html', port=8080, size=(1350, 850), position=(350, 120))
