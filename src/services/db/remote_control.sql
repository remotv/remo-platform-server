--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

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

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: robot_channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE robot_channels (
    name text NOT NULL,
    id text NOT NULL PRIMARY KEY,
    created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    heartbeat timestamp NOT NULL DEFAULT '1970-1-1',
    server_id text NOT NULL REFERENCES robot_servers(server_id) ON DELETE CASCADE,
    chat_id text NOT NULL,
    controls_id text NOT NULL REFERENCES controls(id) ON DELETE CASCADE
);


ALTER TABLE public.robot_channels OWNER TO postgres;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    message character varying,
    sender character varying,
    sender_id character varying,
    chat_id character varying,
    server_id character varying,
    id character varying NOT NULL,
    time_stamp character varying,
    broadcast character varying,
    display_message boolean,
    badges character varying[],
    type character varying,
    channel_id character varying
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms (
    name character varying,
    id character varying,
    host_id character varying,
    messages character varying[],
    created character varying
);


ALTER TABLE public.chat_rooms OWNER TO postgres;

--
-- Name: controls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.controls (
    id character varying NOT NULL,
    channel_id character varying,
    buttons jsonb[],
    created character varying,
    settings jsonb,
    status jsonb
);


ALTER TABLE public.controls OWNER TO postgres;

--
-- Name: generated_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generated_keys (
    key_id character varying NOT NULL,
    created character varying,
    expires character varying,
    ref character varying,
    expired character varying
);


ALTER TABLE public.generated_keys OWNER TO postgres;

--
-- Name: invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invites (
    id character varying NOT NULL,
    created_by character varying,
    server_id character varying,
    created character varying,
    expires character varying NOT NULL,
    status character varying,
    alias character varying,
    is_default boolean
);


ALTER TABLE public.invites OWNER TO postgres;

--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    server_id character varying NOT NULL,
    user_id character varying NOT NULL,
    roles character varying[],
    status jsonb,
    joined character varying,
    invites character varying[],
    username character varying,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: patreon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patreon (
    user_id character varying,
    username character varying,
    patreon_id character varying,
    active_rewards jsonb
);


ALTER TABLE public.patreon OWNER TO postgres;

--
-- Name: robot_servers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.robot_servers (
    owner_id character varying,
    server_id character varying NOT NULL,
    server_name character varying,
    users character varying[],
    created character varying,
    settings jsonb,
    status jsonb,
    channels jsonb[]
);


ALTER TABLE public.robot_servers OWNER TO postgres;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(25),
    password character varying,
    email character varying,
    id character varying NOT NULL,
    created bigint,
    type character varying[],
    check_username character varying,
    session_id character varying,
    status jsonb,
    settings jsonb
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.robot_channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: controls controls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controls
    ADD CONSTRAINT controls_pkey PRIMARY KEY (id);


--
-- Name: generated_keys generated_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_keys
    ADD CONSTRAINT generated_keys_pkey PRIMARY KEY (key_id);


--
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invites
    ADD CONSTRAINT invites_pkey PRIMARY KEY (id);


--
-- Name: members member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT member_pkey PRIMARY KEY (user_id, server_id);


--
-- Name: robot_servers robotServers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.robot_servers
    ADD CONSTRAINT "robotServers_pkey" PRIMARY KEY (server_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: members server_pkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT server_pkey FOREIGN KEY (server_id) REFERENCES public.robot_servers(server_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: patreon user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patreon
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: members user_pkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT user_pkey FOREIGN KEY (server_id) REFERENCES public.robot_servers(server_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--