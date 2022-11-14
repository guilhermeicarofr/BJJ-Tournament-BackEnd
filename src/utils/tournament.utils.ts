function ageClass(age: string): number[] {
    let range: number[] = [0, 0];

    switch (age) {
        case 'junior':
            range = [12, 17];
            break;
        case 'adult':
            range = [18, 29];
            break;
        case 'master':
            range = [30, 99];
            break;
        default:
            break;
    }
    return range;
}

function weightClass(weight: string): number[] {
    let range: number[] = [0, 0];

    switch (weight) {
        case 'feather':
            range = [60, 70];
            break;
        case 'light':
            range = [71, 75];
            break;
        case 'medium':
            range = [76, 82];
            break;
        case 'mid-heavy':
            range = [83, 88];
            break;
        case 'heavy':
            range = [89, 100];
            break;
        case 'absolute':
            range = [0, 999];
            break;
        default:
            break;
    }
    return range;
}

export { ageClass, weightClass };