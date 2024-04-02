import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let traffic_data = [
    {
        name: 'Bancroft',
        auto: 2554,
        bus: 794,
        bicycle: 1740,
        pedestrian: 12600
    },
    {
        name: 'Dana',
        auto: 2280,
        bus: 387,
        bicycle: 2813,
        pedestrian: 12600
    },
    {
        name: 'Telegraph',
        auto: 2397,
        bus: 380,
        bicycle: 300,
        pedestrian: 18000
    },
    {
        name: 'Fulton',
        auto: 3004,
        bus: 0,
        bicycle: 2025,
        pedestrian: 10800
    },
];

traffic_data = traffic_data.map(t => (
    {
        ...t,
        total: Object.values(t).slice(1).reduce((sum, a) => sum + a, 0)
    }
));

const TelegraphTable = () => {
    // console.log(traffic_data);
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Corridor</b></TableCell>
                            <TableCell align="right"><b>Auto</b></TableCell>
                            <TableCell align="right"><b>Bus</b></TableCell>
                            <TableCell align="right"><b>Bicycle</b></TableCell>
                            <TableCell align="right"><b>Pedestrian</b></TableCell>
                            <TableCell align="right"><b>Total</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {traffic_data.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.auto}</TableCell>
                                <TableCell align="right">{row.bus}</TableCell>
                                <TableCell align="right">{row.bicycle}</TableCell>
                                <TableCell align="right">{row.pedestrian}</TableCell>
                                <TableCell align="right">{row.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default TelegraphTable;