--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: athletes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.athletes (
    id integer NOT NULL,
    name text NOT NULL,
    weight integer NOT NULL,
    age integer NOT NULL,
    team text NOT NULL,
    belt_id integer NOT NULL
);


--
-- Name: athletes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.athletes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: athletes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.athletes_id_seq OWNED BY public.athletes.id;


--
-- Name: belts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.belts (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: belts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.belts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: belts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.belts_id_seq OWNED BY public.belts.id;


--
-- Name: athletes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.athletes ALTER COLUMN id SET DEFAULT nextval('public.athletes_id_seq'::regclass);


--
-- Name: belts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belts ALTER COLUMN id SET DEFAULT nextval('public.belts_id_seq'::regclass);


--
-- Data for Name: athletes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.athletes VALUES (1, 'Guilherme Icaro', 85, 27, 'GB Sta Amelia', 3);
INSERT INTO public.athletes VALUES (3, 'Junin', 75, 37, 'GB Sta Amelia', 2);
INSERT INTO public.athletes VALUES (4, 'Douglas', 99, 28, 'GB Centro BH', 5);


--
-- Data for Name: belts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.belts VALUES (1, 'white');
INSERT INTO public.belts VALUES (2, 'blue');
INSERT INTO public.belts VALUES (3, 'purple');
INSERT INTO public.belts VALUES (4, 'brown');
INSERT INTO public.belts VALUES (5, 'black');


--
-- Name: athletes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.athletes_id_seq', 5, true);


--
-- Name: belts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.belts_id_seq', 5, true);


--
-- Name: athletes athletes_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.athletes
    ADD CONSTRAINT athletes_pk PRIMARY KEY (id);


--
-- Name: belts belts_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belts
    ADD CONSTRAINT belts_name_key UNIQUE (name);


--
-- Name: belts belts_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belts
    ADD CONSTRAINT belts_pk PRIMARY KEY (id);


--
-- Name: athletes athletes_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.athletes
    ADD CONSTRAINT athletes_fk0 FOREIGN KEY (belt_id) REFERENCES public.belts(id);


--
-- PostgreSQL database dump complete
--

