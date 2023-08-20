class Hero:
    """ Contains all info about specific hero. """

    def __init__(self, *, id_=None, dotabuff_name=None, name=None, general_winrate=None,
                 update_date=None, winrate_dict=None, image_path=None, roles_set=None):
        self.id = id_
        self.dotabuff_name = dotabuff_name
        self.name = name
        self.general_winrate = general_winrate
        self.update_date = update_date
        self.winrate_dict = winrate_dict
        self.image_path = image_path
        self.roles_set = roles_set

    def __repr__(self):
        return f"""Hero: {self.name}, dotabuff_name: {self.dotabuff_name}, general_winrate: {self.general_winrate}"""


class Role:
    """ Contains info about specific roles for heroes. """

    def __init__(self, *, id_=None, name=None):
        self.id = id_
        self.name = name

    def __repr__(self):
        return f"Role: '{self.name}'"
