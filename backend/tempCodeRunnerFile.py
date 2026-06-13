for attack in attack_entries:
        if attack["name"] in DAMAGE_TYPES:
            print(f"{attack['name']}")