PGDMP         6    
             y            game    13.1    13.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    game    DATABASE     g   CREATE DATABASE game WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Indonesian_Indonesia.1252';
    DROP DATABASE game;
                postgres    false            �            1259    16642 	   tutorials    TABLE     $  CREATE TABLE public.tutorials (
    id integer NOT NULL,
    judul character varying(300) NOT NULL,
    isi text NOT NULL,
    kategori character varying(100) NOT NULL,
    penulis character varying(100) NOT NULL,
    dibuat timestamp with time zone,
    diupdate timestamp with time zone
);
    DROP TABLE public.tutorials;
       public         heap    postgres    false            �            1259    16640    tutorials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tutorials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.tutorials_id_seq;
       public          postgres    false    203            �           0    0    tutorials_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.tutorials_id_seq OWNED BY public.tutorials.id;
          public          postgres    false    202            (           2604    16645    tutorials id    DEFAULT     l   ALTER TABLE ONLY public.tutorials ALTER COLUMN id SET DEFAULT nextval('public.tutorials_id_seq'::regclass);
 ;   ALTER TABLE public.tutorials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            �          0    16642 	   tutorials 
   TABLE DATA           X   COPY public.tutorials (id, judul, isi, kategori, penulis, dibuat, diupdate) FROM stdin;
    public          postgres    false    203   :       �           0    0    tutorials_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.tutorials_id_seq', 3, true);
          public          postgres    false    202            *           2606    16650    tutorials tutorials_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.tutorials DROP CONSTRAINT tutorials_pkey;
       public            postgres    false    203            �      x������ � �     