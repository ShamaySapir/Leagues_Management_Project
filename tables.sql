CREATE TABLE dbo.teams
(   
    teamId INTEGER NOT NULL,    
    team_name NVARCHAR NOT NULL,
    country_id INTEGER NOT NULL,
    founded INTEGER NOT NULL,
    logo_path NVARCHAR NOT NULL,
    venue_id INTEGER NOT NULL,
    current_season_id INTEGER NOT NULL
);
