import React, {useState} from 'react';
import Dialog from "@mui/material/Dialog";
import makeStyles from '@mui/styles/makeStyles';
import {Fab} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import Divider from "@mui/material/Divider";
import EntitySelection from "./EntitySelection";
import EditAccessPackageAppBar from "./EditAccessPackageTemplateAppBar";
import EditAccessPackageDialog from "./EditAccessPackageTemplateDialog";
import ConfirmAccessPackageUpdate from "./ConfirmAccessPackageTemplateUpdate";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {updateAccessPackages} from "../../../data/redux/actions/access_templates";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    addButton: {
        margin: theme.spacing(1),
        top: theme.spacing(10),
        right: theme.spacing(3),
        position: "absolute"
    }
}));

const EditAccessPackageContainer = (props) => {
    const {
        open, handleClose, handleSaveAccess, setEditOpen, openSave, handleSaveClose,
        setSnackBarOpen, setSnackBarMessage
    } = props;
    const classes = useStyles();
    const [componentSelectorOpen, setComponentSelectorOpen] = useState(false);
    const [openCloseDialog, setOpenCloseDialog] = useState(false);
    const selectedForEditingId = useSelector(state => state.accessTemplate.selectedForEditing);
    const accessTemplates = useSelector(state => state.accessTemplate.access_templates);
    const componentConfiguration = useSelector(state => state.component_configuration.componentConfiguration);
    const dispatch = useDispatch();

    let selectedAccessPackage = undefined;
    accessTemplates.map(ap => {
        if (ap.dn === selectedForEditingId) {
            selectedAccessPackage = ap;
        }
        return ap;
    });

    function openComponentSelector() {
        setComponentSelectorOpen(true);
    }

    function handleCloseComponentSelector() {
        setComponentSelectorOpen(false);
    }

    function removePathsFromList(list, component) {
        return list.filter(path => {
            let keepPath = true;
            component.classes.forEach(aClass => {
                if (aClass.path === path) {
                    keepPath = false;
                }
            });
            return keepPath;
        });
    }

    function chooseComponent(component) {
        let newAccessPackages = [...accessTemplates];
        let newAccessPackage = {...selectedAccessPackage};
        const accessPackageIndex = newAccessPackages.indexOf(newAccessPackages.filter(ap => ap.dn === newAccessPackage.dn)[0]);

        if (newAccessPackage.components.includes(component.dn)) {
            let componentIndex = newAccessPackage.components.indexOf(component.dn);
            newAccessPackage.components.splice(componentIndex, 1);
            newAccessPackage.collection = removePathsFromList(newAccessPackage.collection, component);
            newAccessPackage.read = removePathsFromList(newAccessPackage.read, component);
            newAccessPackage.modify = removePathsFromList(newAccessPackage.modify, component);
        } else {
            newAccessPackage.components.push(component.dn);
        }
        newAccessPackages[accessPackageIndex] = newAccessPackage;
        dispatch(updateAccessPackages(newAccessPackages));
    }

    function closeCloseDialog() {
        setOpenCloseDialog(false);
    }

    return (
        <>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <EditAccessPackageAppBar
                    classes={classes}
                    handleClose={setOpenCloseDialog}
                    handleSaveAccess={handleSaveAccess}
                    selectedAccessPackage={selectedAccessPackage}/>
                <Divider/>

                <EntitySelection selectedAccessPackage={selectedAccessPackage}/>
                <Fab color="secondary"
                     className={classes.addButton}
                     onClick={openComponentSelector}
                >
                    <Add/>
                </Fab>

                <EditAccessPackageDialog
                    componentSelectorOpen={componentSelectorOpen}
                    handleCloseComponentSelector={handleCloseComponentSelector}
                    componentConfiguration={componentConfiguration}
                    selectedAccessPackage={selectedAccessPackage}
                    chooseComponent={chooseComponent}/>
                <ConfirmAccessPackageUpdate
                    open={openSave} handleClose={handleSaveClose} setEditOpen={setEditOpen}
                    handleExit={handleClose}
                    setSnackBarOpen={setSnackBarOpen} setSnackBarMessage={setSnackBarMessage}/>
                <Dialog
                    open={openCloseDialog}
                    onClose={closeCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle
                        id="alert-dialog-title">{"Avslutte redigering. Ingen endringer blir lagret."}</DialogTitle>
                    <DialogActions>
                        <Button variant="contained"
                                onClick={() => {
                                    setOpenCloseDialog(false);
                                    handleClose();
                                }} color="primary" autoFocus>
                            Avslutt
                        </Button>
                        <Button variant="contained" onClick={closeCloseDialog} color="primary">
                            Fortsett redigering
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </>
    );
};

export default EditAccessPackageContainer;
