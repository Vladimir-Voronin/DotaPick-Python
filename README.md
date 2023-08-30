# DotaPick

Download: [HERE](https://github.com/Vladimir-Voronin/DotaPick/releases/tag/dotapick-beta)

DotaPick is a simple app that helps the user analyze the picking phase in Dota 2.

You can see the overall stats for each hero in the game, pick heroes for the enemy and your team, and see which heroes are best picks and which aren't as good as you thought.

Since Dota API doesn't work well (it requires my money), the hero stats are taken from [dotabuff.com](https://www.dotabuff.com/). Because of that, data is static and you need to press "update DB" button in order to receive some new statistics. It may take some time (depends on your internet connection).

All data is presented on the current patch.

## Installation guide:
You can download .exe version:
1) Download link: [HERE](https://github.com/Vladimir-Voronin/DotaPick/releases/tag/dotapick-beta)
2) Simply unzip archive and run ```DotaPick.exe```

Or you can use Python:
1) Download Python 3.10 (or higher) on your computer.
2) Go to directory where you want to download the app.
3) use ```git clone "https://github.com/Vladimir-Voronin/DotaPick.git"```
4) use ```pip install -r DotaPick/requirements.txt``` (or if you open downloaded folder: ```pip install -r requirements.txt```)
5) Run ```DotaPick.bat``` file to run the app. You can also go to "DotaPick" directory and run the app with ```main.py``` file or use ```python main.py``` command.
