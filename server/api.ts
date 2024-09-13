import 'reflect-metadata';
import * as express from 'express';
import { config } from './config';
import { ExpressApp } from './loaders/express';
import { serve } from './serve';

const app = new ExpressApp(express());
serve(app, config.port);
