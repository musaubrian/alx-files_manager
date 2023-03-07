import { Router } from "express";
import AppController from "../controllers/AppController";
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import { basicAuthenticate, xTokenAuthenticate } from '../additionalUtils/auth';
import { APIError, errorResponse } from '../additionalUtils/error';

const router = Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);

router.get('/connect', basicAuthenticate, AuthController.getConnect);
router.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect);

router.post('/users', UsersController.postNew);
router.get('/users/me', xTokenAuthenticate, UsersController.getMe);
router.post('/files', xTokenAuthenticate, FilesController.postUpload);

module.exports = router;