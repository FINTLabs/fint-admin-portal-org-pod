import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {Typography} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import RemoveIcon from "@mui/icons-material/RemoveCircleRounded";
import {useSelector} from "react-redux";


const useStyles = makeStyles(theme => ({
    addingText: {
        color: "green",
    },
    removingText: {
        color: "red",
    }
}));

const ChangedAccesses = (props) => {
    const classes = useStyles();
    const {oldAccessPackage, newAccessPackage} = props;
    const componentConfiguration = useSelector(state => state.component_configuration.componentConfiguration);
    const collectionList = [];
    const readList = [];
    const modifyList = [];

    function addDissimilarityToList(array, array2, list) {
        array.forEach(entry => {
            if (!array2.includes(entry)) {
                const text = "+ " + entry;
                list.push(text);
            }
        });
        array2.forEach(entry => {
            if (!array.includes(entry)){
                const text = "- " + entry;
                list.push(text);
            }
        })
    }

    function getEntity(entity){
        componentConfiguration.forEach(componentConfiguration => {
            componentConfiguration.classes.forEach(aClass => {
                if (aClass.path === entity){
                    entity = componentConfiguration.displayName + " " + aClass.name;
                }
            });
        });
        return entity;
    }

    function accessListItem(entry) {
        const removingEntry = entry.charAt(0) === "-";
        let entity = entry.substring(2, entry.length);
        entity = getEntity(entity);
        return (
            <ListItem key={entry}>
                <ListItemIcon>
                    {removingEntry ? <RemoveIcon className={classes.removingText}/> :
                        <AddIcon className={classes.addingText}/>}
                </ListItemIcon>
                <ListItemText
                    primary={entity}
                />
            </ListItem>
        );
    }

    addDissimilarityToList(newAccessPackage.collection, oldAccessPackage.collection, collectionList);
    addDissimilarityToList(newAccessPackage.read, oldAccessPackage.read, readList);
    addDissimilarityToList(newAccessPackage.modify, oldAccessPackage.modify, modifyList);

    return (
        <div>
            <List dense>
                {collectionList.length > 0 ? <Typography>Bulk</Typography> : null}
                {collectionList.map(entry => {
                    return accessListItem(entry);
                })}
                {readList.length > 0 ? <Typography>Single</Typography> : null}
                {readList.map(entry => {
                    return accessListItem(entry);

                })}
                {modifyList.length > 0 ? <Typography>Endre</Typography> : null}
                {modifyList.map(entry => {
                    return accessListItem(entry);
                })}
            </List>
        </div>
    );
};

export default ChangedAccesses;