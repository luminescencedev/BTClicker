------------------------------------------------------------
--        Script PostgreSQL complet avec mise à jour
------------------------------------------------------------

-- Supprimer les tables existantes si elles existent déjà
DROP TABLE IF EXISTS public.Rendez_vous CASCADE;
DROP TABLE IF EXISTS public.Users CASCADE;
DROP TABLE IF EXISTS public.Reviews CASCADE;
DROP TABLE IF EXISTS public.Services CASCADE;
DROP TABLE IF EXISTS public.Salons CASCADE;
DROP TABLE IF EXISTS public.Categories CASCADE;

-- Création des séquences pour les ID
CREATE SEQUENCE public.Categories_id_category_seq;
CREATE SEQUENCE public.Salons_id_salon_seq;
CREATE SEQUENCE public.Services_id_service_seq;
CREATE SEQUENCE public.Reviews_id_review_seq;
CREATE SEQUENCE public.Users_id_user_seq;
CREATE SEQUENCE public.Rendez_vous_id_rendezvous_seq;

ALTER SEQUENCE public.Categories_id_category_seq RESTART WITH 1;
ALTER SEQUENCE public.Salons_id_salon_seq RESTART WITH 1;
ALTER SEQUENCE public.Services_id_service_seq RESTART WITH 1;
ALTER SEQUENCE public.Reviews_id_review_seq RESTART WITH 1;
ALTER SEQUENCE public.Users_id_user_seq RESTART WITH 1;
ALTER SEQUENCE public.Rendez_vous_id_rendezvous_seq RESTART WITH 1;

------------------------------------------------------------
-- Table: Categories
------------------------------------------------------------
CREATE TABLE public.Categories(
    id_category   SERIAL NOT NULL,
    name          VARCHAR (50) NOT NULL UNIQUE,
    picture       VARCHAR (2000) NOT NULL,
    description   VARCHAR (2000) NOT NULL,
    created_at    DATE NOT NULL,
    updated_at    DATE NOT NULL,
    CONSTRAINT Categories_PK PRIMARY KEY (id_category)
)WITHOUT OIDS;

-- Insertion des catégories
INSERT INTO public.Categories (name, picture, description, created_at, updated_at)
VALUES
('Coiffeur', 'url_to_image', 'Description de la catégorie Coiffeur', current_date, current_date),
('Barbier', 'url_to_image', 'Description de la catégorie Barbier', current_date, current_date),
('Manucure', 'url_to_image', 'Description de la catégorie Manucure', current_date, current_date);

------------------------------------------------------------
-- Table: Salons
------------------------------------------------------------
CREATE TABLE public.Salons(
    id_salon      SERIAL NOT NULL,
    name          VARCHAR (50) NOT NULL UNIQUE,
    adress        VARCHAR (50) NOT NULL,
    city          VARCHAR (50) NOT NULL,
    picture       VARCHAR (2000) NOT NULL,
    description   VARCHAR (2000) NOT NULL,
    created_at    DATE NOT NULL,
    updated_at    DATE NOT NULL,
    id_category   INT NOT NULL,
    CONSTRAINT Salons_PK PRIMARY KEY (id_salon),
    CONSTRAINT Salons_Categories_FK FOREIGN KEY (id_category) REFERENCES public.Categories(id_category)
)WITHOUT OIDS;

-- Salons de Coiffeur
INSERT INTO public.Salons (name, adress, city, picture, description, created_at, updated_at, id_category) VALUES
('Coiffure Élégance', '1 Rue de Paris', 'Paris', 'image_salon_1.png', 'Salon moderne offrant une coupe stylée et personnalisée selon vos préférences.', current_date, current_date, 1),
('La Tête au Carré', '2 Rue de Paris', 'Paris', 'image_salon_2.png', 'Un salon réputé pour ses coupes innovantes et son service client exceptionnel.', current_date, current_date, 1),
('Coupe Précise', '3 Rue de Paris', 'Paris', 'image_salon_3.png', 'Des experts en coiffure créative vous aideront à adopter un style unique et tendance.', current_date, current_date, 1),
('Lyon Coiffure', '4 Rue de Lyon', 'Lyon', 'image_salon_4.png', 'Nos coiffeurs expérimentés vous offrent une coupe qui respecte vos envies et votre personnalité.', current_date, current_date, 1),
('Chic et Court', '5 Rue de Lyon', 'Lyon', 'image_salon_5.png', 'Salon où chaque client se voit offrir une coupe moderne et sophistiquée sur mesure.', current_date, current_date, 1),
('Lyon Style', '6 Rue de Lyon', 'Lyon', 'image_salon_6.png', 'Faites confiance à nos coiffeurs pour un style personnalisé et une coupe parfaite.', current_date, current_date, 1),
('Marseille Coiffure', '7 Rue de Marseille', 'Marseille', 'image_salon_7.png', 'Venez découvrir notre salon où chaque coupe reflète votre personnalité et vos attentes.', current_date, current_date, 1),
('Coupes & Styles', '8 Rue de Marseille', 'Marseille', 'image_salon_8.png', 'Le salon où vos cheveux sont pris en main avec expertise pour un look tendance.', current_date, current_date, 1),
('Marseille Glam', '9 Rue de Marseille', 'Marseille', 'image_salon_9.png', 'Un salon chic à Marseille pour une coupe élégante et un service premium adapté à vous.', current_date, current_date, 1),
('Bordeaux Hair', '10 Rue de Bordeaux', 'Bordeaux', 'image_salon_10.png', 'Coiffeurs professionnels vous offrant un service sur-mesure pour une coupe parfaite.', current_date, current_date, 1),
('Le Style Toulousain', '11 Rue de Toulouse', 'Toulouse', 'image_salon_10.png', 'Là où la coupe rencontre l’art, et où chaque client est traité comme une star.', current_date, current_date, 1),
('Strasbourg hair', '12 Rue de Strasbourg', 'Strasbourg', 'image_salon_10.png', 'Le salon pour ceux qui recherchent une coupe de cheveux raffinée et soignée.', current_date, current_date, 1),
('Éclat Coiffure', '13 Rue de Nice', 'Nice', 'image_salon_10.png', 'Coiffeurs experts pour une coupe qui respecte à la fois la mode et votre personnalité.', current_date, current_date, 1),
('Salon Prestige', '14 Rue de Lille', 'Lille', 'image_salon_10.png', 'Chez nous, chaque client est assuré de repartir avec une coupe qui lui va parfaitement.', current_date, current_date, 1),
('L’Atelier Coiffure', '15 Rue de Nantes', 'Nantes', 'image_salon_10.png', 'Un salon où la coupe n’est pas juste un métier, mais une véritable passion.', current_date, current_date, 1);

-- Salons de Barbier
INSERT INTO public.Salons (name, adress, city, picture, description, created_at, updated_at, id_category) VALUES
('Barbier Royal', '1 Rue de Paris', 'Paris', 'image_salon_16.png', 'Un barbier classique avec une touche moderne, parfait pour une coupe soignée et élégante.', current_date, current_date, 2),
('La Barbe Élégante', '2 Rue de Paris', 'Paris', 'image_salon_17.png', 'Des soins de barbe et de cheveux dans un cadre intime et élégant à Paris.', current_date, current_date, 2),
('Barbe & Style', '3 Rue de Paris', 'Paris', 'image_salon_18.png', 'Le barbier tendance où chaque détail de votre coupe de barbe est maîtrisé à la perfection.', current_date, current_date, 2),
('Lyon Barbier', '4 Rue de Lyon', 'Lyon', 'image_salon_19.png', 'Barbier traditionnel avec une approche moderne pour des barbes impeccables et stylées.', current_date, current_date, 2),
('La Maison de la Barbe', '5 Rue de Lyon', 'Lyon', 'image_salon_20.png', 'Venez découvrir un salon de barbier où l’art de tailler la barbe se transforme en rituel.', current_date, current_date, 2),
('Barbier & Co', '6 Rue de Lyon', 'Lyon', 'image_salon_21.png', 'Un barbier dynamique et créatif, offrant des services de qualité pour une barbe parfaite.', current_date, current_date, 2),
('Marseille Barbe', '7 Rue de Marseille', 'Marseille', 'image_salon_22.png', 'Des experts du rasage et du soin de la barbe pour une expérience inoubliable.', current_date, current_date, 2),
('Le Barbier Marseillais', '8 Rue de Marseille', 'Marseille', 'image_salon_23.png', 'Un salon où la coupe de barbe devient une véritable œuvre d’art, à Marseille.', current_date, current_date, 2),
('Barbier du Sud', '9 Rue de Marseille', 'Marseille', 'image_salon_24.png', 'Offrez à votre barbe une coupe soignée et moderne dans un cadre agréable et raffiné.', current_date, current_date, 2),
('Barber Lounge', '10 Rue de Nice', 'Nice', 'image_salon_10.png', 'Un salon de barbier où chaque service est effectué avec précision et passion pour la barbe.', current_date, current_date, 2),
('Lyon Barbier Chic', '11 Rue de Toulouse', 'Toulouse', 'image_salon_10.png', 'Rasages et tailles de barbe réalisés par des professionnels pour un look impeccable.', current_date, current_date, 2),
('Le Barbier Moderne', '12 Rue de Strasbourg', 'Strasbourg', 'image_salon_10.png', 'Redécouvrez l’art du rasage traditionnel avec des produits de qualité supérieure.', current_date, current_date, 2),
('Barbier et Tradition', '13 Rue de Bordeaux', 'Bordeaux', 'image_salon_10.png', 'Des services de rasage et coupe de barbe dans un environnement traditionnel et moderne.', current_date, current_date, 2),
('Barbe & Chic', '14 Rue de Lille', 'Lille', 'image_salon_10.png', 'Barbier classique et moderne pour des prestations de qualité adaptées à tous les styles.', current_date, current_date, 2),
('Le Barbier nanterois', '15 Rue de Nantes', 'Nantes', 'image_salon_10.png', 'Un salon de barbier à la fois élégant et accueillant, pour un rasage à la perfection.', current_date, current_date, 2);

-- Salons de Manucure
INSERT INTO public.Salons (name, adress, city, picture, description, created_at, updated_at, id_category) VALUES
('Manucure Parisienne', '1 Rue de Paris', 'Paris', 'image_salon_31.png', 'Des manucures élégantes et raffinées dans un salon chic au cœur de Paris.', current_date, current_date, 3),
('Les Ongles de Paris', '2 Rue de Paris', 'Paris', 'image_salon_32.png', 'Un service de manucure haut de gamme pour des mains impeccables et bien entretenues.', current_date, current_date, 3),
('Nantes Nail Studio', '3 Rue de Nantes', 'Nantes', 'image_salon_10.png', 'Salon moderne spécialisé dans les manucures tendances avec des soins de qualité supérieure.', current_date, current_date, 3),
('Manucure Lyon', '4 Rue de Lyon', 'Lyon', 'image_salon_34.png', 'Une manucure parfaite avec des produits naturels dans une ambiance détendue à Lyon.', current_date, current_date, 3),
('Ongles et Éclat', '5 Rue de Lille', 'Lille', 'image_salon_10.png', 'Pour des mains soignées et des ongles éclatants, notre salon vous offre des soins personnalisés.', current_date, current_date, 3),
('Lyon Nail Art', '6 Rue de Lyon', 'Lyon', 'image_salon_36.png', 'Le salon incontournable pour des manucures créatives et des soins de qualité supérieure.', current_date, current_date, 3),
('Marseille Ongles', '7 Rue de Marseille', 'Marseille', 'image_salon_37.png', 'Un endroit chic à Marseille pour des manucures artistiques et des ongles parfaits.', current_date, current_date, 3),
('Manucure Glamour', '8 Rue de Marseille', 'Marseille', 'image_salon_10.png', 'Un salon où chaque client bénéficie d’un service de manucure de qualité, avec des produits de luxe.', current_date, current_date, 3),
('Luxe Nails', '9 Rue de Strasbourg', 'Strasbourg', 'image_salon_10.png', 'Ongles parfaits et manucure de qualité dans un cadre haut de gamme et agréable.', current_date, current_date, 3),
('Bordeaux Nail Spa', '10 Rue de Bordeaux', 'Bordeaux', 'image_salon_10.png', 'Venez vivre une expérience relaxante et beauté avec des manucures et soins de luxe à Bordeaux.', current_date, current_date, 3),
('Toulouse Nail Lounge', '11 Rue de Toulouse', 'Toulouse', 'image_salon_10.png', 'Offrez à vos mains des manucures parfaites et des soins adaptés à vos besoins à Toulouse.', current_date, current_date, 3),
('Nice Nails Studio', '12 Rue de Nice', 'Nice', 'image_salon_10.png', 'Nous offrons des manucures de qualité dans un espace moderne et accueillant à Nice', current_date, current_date, 3);

------------------------------------------------------------
-- Table: Services
------------------------------------------------------------
CREATE TABLE public.Services(
    id_service    SERIAL NOT NULL,
    price         DECIMAL (10,2) NOT NULL,
    time          INT NOT NULL,
    description   VARCHAR (2000) NOT NULL,
    created_at    DATE NOT NULL,
    updated_at    DATE NOT NULL,
    id_salon      INT NOT NULL,
    CONSTRAINT Services_PK PRIMARY KEY (id_service),
    CONSTRAINT Services_Salons_FK FOREIGN KEY (id_salon) REFERENCES public.Salons(id_salon) ON DELETE CASCADE
)WITHOUT OIDS;

-- Insertion des services
INSERT INTO public.Services (price, time, description, created_at, updated_at, id_salon)
VALUES
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 1),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 2),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 3),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 4),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 5),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 6),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 7),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 8),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 9),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 1),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 2),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 3),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 4),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 5),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 6),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 7),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 8),
(30.00, 60, 'Coupe de cheveux enfant', current_date, current_date, 9),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 10),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 11),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 12),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 13),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 14),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 15),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 16),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 17),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 18),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 19),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 20),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 21),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 22),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 23),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 24),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 25),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 26),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 27),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 28),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 29),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 30),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 31),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 32),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 33),
(30.00, 60, 'Coupe de cheveux', current_date, current_date, 34),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 2),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 8),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 7),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 6),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 5),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 4),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 3),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 2),
(20.00, 45, 'Rasage de barbe', current_date, current_date, 1),
(20.00, 45, 'Taillage barbe', current_date, current_date, 16),
(20.00, 45, 'Taillage barbe', current_date, current_date, 17),
(20.00, 45, 'Taillage barbe', current_date, current_date, 18),
(20.00, 45, 'Taillage barbe', current_date, current_date, 19),
(20.00, 45, 'Taillage barbe', current_date, current_date, 20),
(20.00, 45, 'Taillage barbe', current_date, current_date, 21),
(20.00, 45, 'Taillage barbe', current_date, current_date, 22),
(20.00, 45, 'Taillage barbe', current_date, current_date, 23),
(20.00, 45, 'Taillage barbe', current_date, current_date, 24),
(15.00, 25, 'Pose ongle', current_date, current_date, 31),
(15.00, 25, 'Pose ongle', current_date, current_date, 32),
(15.00, 25, 'Pose ongle', current_date, current_date, 33),
(15.00, 25, 'Pose ongle', current_date, current_date, 34),
(15.00, 25, 'Pose ongle', current_date, current_date, 35),
(15.00, 25, 'Pose ongle', current_date, current_date, 36),
(15.00, 25, 'Pose ongle', current_date, current_date, 37),
(15.00, 25, 'Pose ongle', current_date, current_date, 38),
(15.00, 25, 'Pose ongle', current_date, current_date, 39),
(15.00, 25, 'Pose ongle', current_date, current_date, 40),
(15.00, 25, 'Pose ongle', current_date, current_date, 41),
(15.00, 25, 'Pose ongle', current_date, current_date, 42),
(27.00, 35, 'Brushing', current_date, current_date, 31),
(27.00, 35, 'Brushing', current_date, current_date, 32),
(27.00, 35, 'Brushing', current_date, current_date, 33),
(27.00, 35, 'Brushing', current_date, current_date, 34),
(27.00, 35, 'Brushing', current_date, current_date, 35),
(27.00, 35, 'Brushing', current_date, current_date, 36),
(27.00, 35, 'Brushing', current_date, current_date, 37),
(27.00, 35, 'Brushing', current_date, current_date, 38),
(27.00, 35, 'Brushing', current_date, current_date, 39),
(27.00, 35, 'Brushing', current_date, current_date, 40),
(27.00, 35, 'Brushing', current_date, current_date, 41),
(27.00, 35, 'Brushing', current_date, current_date, 42);

------------------------------------------------------------
-- Table: Reviews
------------------------------------------------------------
CREATE TABLE public.Reviews(
    id_review     SERIAL NOT NULL,
    rating        INT NOT NULL,
    description   VARCHAR (2000) NOT NULL,
    created_at    DATE NOT NULL,
    updated_at    DATE NOT NULL,
    id_salon      INT NOT NULL,
    CONSTRAINT Reviews_PK PRIMARY KEY (id_review),
    CONSTRAINT Reviews_Salons_FK FOREIGN KEY (id_salon) REFERENCES public.Salons(id_salon) ON DELETE CASCADE
)WITHOUT OIDS;
-- Insertion des avis
INSERT INTO public.Reviews (rating, description, created_at, updated_at, id_salon)
VALUES
(5, 'Excellent service!', current_date, current_date, 1),
(4, 'Très bon mais peut s''améliorer', current_date, current_date, 2);

------------------------------------------------------------
-- Table: Users
------------------------------------------------------------
CREATE TABLE public.Users(
    id_user      SERIAL NOT NULL,
    role         VARCHAR (50) NOT NULL,
    first_name   VARCHAR (50) NOT NULL,
    last_name    VARCHAR (50) NOT NULL,
    age          INT NOT NULL,
    mail         VARCHAR (80) NOT NULL UNIQUE,
    phone        VARCHAR(10) NOT NULL UNIQUE,
    city          VARCHAR (50) NOT NULL,
    password     VARCHAR (255) NOT NULL,
    created_at   DATE NOT NULL,
    updated_at   DATE NOT NULL,
    id_salon     INT,
    CONSTRAINT Users_PK PRIMARY KEY (id_user),
    CONSTRAINT Users_Salons_FK FOREIGN KEY (id_salon) REFERENCES public.Salons(id_salon) ON DELETE SET NULL
)WITHOUT OIDS;
-- Insertion des utilisateurs
INSERT INTO public.Users (role, first_name, last_name, age, mail, phone, city, password, created_at, updated_at, id_salon)
VALUES
('Admin', 'John', 'Doe', 30, 'john.doe@example.com', '1234567890', 'Paris', 'password123', current_date, current_date, 1),
('User', 'Jane', 'Smith', 25, 'jane.smith@example.com', '0987654321', 'Lyon', 'password456', current_date, current_date, 2);

------------------------------------------------------------
-- Table: Rendez_vous (Mise à jour avec le champ 'id_service')
------------------------------------------------------------
CREATE TABLE public.Rendez_vous(
    id_rendezvous SERIAL NOT NULL,
    date          DATE NOT NULL,
    time          TIME NOT NULL,
    created_at    TIMESTAMP  NOT NULL,
    updated_at    TIMESTAMP  NOT NULL,
    id_salon      INT NOT NULL,
    id_user       INT NOT NULL,
    id_service    INT NOT NULL,
    CONSTRAINT Rendez_vous_PK PRIMARY KEY (id_rendezvous),
    CONSTRAINT Rendez_vous_Salons_FK FOREIGN KEY (id_salon) REFERENCES public.Salons(id_salon) ON DELETE CASCADE,
    CONSTRAINT Rendez_vous_Users_FK FOREIGN KEY (id_user) REFERENCES public.Users(id_user) ON DELETE CASCADE,
    CONSTRAINT Rendez_vous_Services_FK FOREIGN KEY (id_service) REFERENCES public.Services(id_service) ON DELETE CASCADE
)WITHOUT OIDS;

-- Insertion des rendez-vous avec le service
INSERT INTO public.Rendez_vous (date, time, created_at, updated_at, id_salon, id_user, id_service)
VALUES
(current_date + interval '1 day', '14:30:00', current_date, current_date, 1, 1, 1),  -- Coupe de cheveux
(current_date + interval '2 days', '16:00:00', current_date, current_date, 2, 2, 2);  -- Rasage de barbe
