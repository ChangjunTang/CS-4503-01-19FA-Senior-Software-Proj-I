const JJBPBOT = {};

(function (namespace) {
    namespace.main = function () {
        fetchPasswords();
        setupSearch();
        setupPasswordInputForm();
        setupModal();
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const alertTimer = null;

    function setupSearch() {
        document.querySelector('#search').addEventListener('keyup', function (e) {
            for (let entry of document.querySelectorAll('.entry')) {
                const title = entry.querySelector('.title').innerHTML.toUpperCase();
                const username = entry.querySelector('.username').innerHTML.toUpperCase();
                const password = entry.querySelector('.password').innerHTML.toUpperCase();
                const searchVal = document.querySelector('#search').value.toUpperCase();

                if (title.indexOf(searchVal) <= -1 && username.indexOf(searchVal) <= -1 && password.indexOf(searchVal) <= -1) {
                    entry.classList.add('d-none');
                }
                else if (searchVal === '') {
                    entry.classList.remove('d-none');
                }
                else {
                    entry.classList.remove('d-none');
                }
            };
        });
    }

    async function fetchPasswords() {
        let res = await fetch('/api/v1/passwords', {
            headers: {
                'CSRF-Token': csrfToken
            },
        });
        res = await res.json();

        if (res.error || !res.data.items) {
            return;
        }

        let html = '';

        for (let entry of res.data.items) {
            html += `
                <tr class="entry">
                    <td class="title align-middle">${entry.title}</td>
                    <td class="username align-middle">${entry.storedUsername}</td>
                    <td class="password align-middle hide">${entry.storedPassword}</td>
                    <td><button class="showBtn tableBtn">Show</button></td>
                    <td><button class="delete tableBtn">Delete</button></td>
                </tr>
            `;
        }

        document.querySelector('#passwords tbody').innerHTML = html;
        setupDelete();
        setupHide();
    }

    function setupDelete() {
        for (let entry of document.querySelectorAll('.entry')) {
            const btn = entry.querySelector('.delete');
            btn.addEventListener('click', async function (e) {
                const title = entry.querySelector('.title').innerHTML
                const username = entry.querySelector('.username').innerHTML;
                await deleteEntry(title, username);
                fetchPasswords();
            });
        }
    }

    function setupHide() {
        for (let entry of document.querySelectorAll('.entry')) {
            const btn = entry.querySelector('.showBtn');
            btn.addEventListener('click', function (e) {
                const password = entry.querySelector('.password');
                btn.innerHTML = btn.innerHTML === 'Show' ? 'Hide' : 'Show';
                password.classList.toggle('hide');
            });
        }
    }

    function deleteEntry(title, username) {
        const body = new URLSearchParams();
        body.append('title', title);
        body.append('username', username);

        return fetch('/api/v1/passwords', {
            method: 'delete',
            body,
            headers: {
                'CSRF-Token': csrfToken
            },
        });
    }

    function setupPasswordInputForm() {
        document.forms[0].submit.addEventListener('click', async function (e) {
            e.preventDefault();
            clearTimeout(alertTimer);
            $('.alert') && $('.alert').alert('close');

            const body = new URLSearchParams();
            for (let input of document.forms[0].elements) {
                body.append(input.name, input.value);
            }

            let res = await fetch('/api/v1/passwords', {
                method: 'post',
                body,
                headers: {
                    'CSRF-Token': csrfToken
                },
            });

            res = await res.json();

            if (res.error) {
                const alert = `
                    <div class="alert alert-danger" role="alert">
                        ${res.error.message}
                    </div>
                `;
                document.querySelector('body').insertAdjacentHTML('beforeend', alert);
                alertTimer = setTimeout(() => $('.alert').alert('close'), 5000);
            }
            else {
                const alert = `
                    <div class="alert alert-success" role="alert">
                        Successfully added password!
                    </div>
                `;
                document.querySelector('body').insertAdjacentHTML('beforeend', alert);
                alertTimer = setTimeout(() => $('.alert').alert('close'), 5000);
                fetchPasswords();
            }
        });
    }

    namespace.passwordGenerator = namespace.passwordGenerator || {};

    (function (namespace) {
        namespace.prevLen = 12;
        namespace.nums = true;
        namespace.specs = true;
        namespace._pattern = /[a-zA-Z]/;

        function getRandomByte() {
            // http://caniuse.com/#feat=getrandomvalues
            if (window.crypto && window.crypto.getRandomValues) {
                var result = new Uint8Array(1);
                window.crypto.getRandomValues(result);
                return result[0];
            } else if (window.msCrypto && window.msCrypto.getRandomValues) {
                var result = new Uint8Array(1);
                window.msCrypto.getRandomValues(result);
                return result[0];
            } else {
                return Math.floor(Math.random() * 256);
            }
        };

        function generate(length) {
            return Array.apply(null, {
                'length': length
            })
                .map(function () {
                    var result;
                    while (true) {
                        result = String.fromCharCode(getRandomByte());
                        if (namespace._pattern.test(result)) {
                            return result;
                        }
                    }
                }, this)
                .join('');
        };

        namespace.scorePassword = function (pass) {
            var score = 0;
            if (!pass)
                return score;

            // award every unique letter until 5 repetitions
            var letters = new Object();
            for (var i = 0; i < pass.length; i++) {
                letters[pass[i]] = (letters[pass[i]] || 0) + 1;
                score += 7.0 / letters[pass[i]];
            }

            // bonus points for mixing it up
            var variations = {
                digits: /\d/.test(pass),
                lower: /[a-z]/.test(pass),
                upper: /[A-Z]/.test(pass),
                nonWords: /\W/.test(pass),
            }

            variationCount = 0;
            for (var check in variations) {
                variationCount += (variations[check] == true) ? 1 : 0;
            }
            score += (variationCount - 1) * 10;

            return parseInt(score);
        }

        namespace.generatePassword = function (len) {
            if (namespace.specs == false && namespace.nums == false) {
                namespace._pattern = /[a-zA-Z]/;
            }
            if (namespace.specs == false && namespace.nums == true) {
                namespace._pattern = /[a-zA-Z0-9]/;
            }
            if (namespace.specs == true && namespace.nums == false) {
                namespace._pattern = /[a-zA-Z!\@\#\$\%\^\&\*\.\?\-\_\+]/;
            }
            if (namespace.specs == true && namespace.nums == true) {
                namespace._pattern = /[a-zA-Z0-9!\@\#\$\%\^\&\*\.\?\-\_\+]/;
            }

            $("#modalPass").val(generate(len));
        }
    })(namespace.passwordGenerator);

    function setupModal() {
        document.getElementById('addPasswordButton')
            .addEventListener('click', function doThings() {
                namespace.passwordGenerator.generatePassword($("#slider").val());
                $('#addPasswordModal').modal('show');

            });

        document.getElementById('submitModal')
            .addEventListener('click', function doThings() {
                $('#addPasswordModal').modal('hide');
                document.getElementById("modalTitle").value = "";
                document.getElementById("modalUser").value = "";
                document.getElementById("modalPass").value = "";
            });

        $('#addPasswordModal').on('hidden.bs.modal', function () {
            document.getElementById("modalTitle").value = "";
            document.getElementById("modalUser").value = "";
            document.getElementById("modalPass").value = "";
        });

        $("#slider").on("mousemove mouseup", function () {
            var length = $(this).val();
            $("#text").text("Length: " + length);
            if (namespace.passwordGenerator.prevLen != length) {
                namespace.passwordGenerator.generatePassword(length);
                namespace.passwordGenerator.prevLen = length;
            }
        });

        $("#num").on("mouseup", function () {
            if (!$("#num").prop('checked')) {
                namespace.passwordGenerator.nums = true;
            } else {
                namespace.passwordGenerator.nums = false;
            }
            namespace.passwordGenerator.generatePassword(namespace.passwordGenerator.prevLen);
        });

        $("#spec").on("mouseup", function () {
            if (!$("#spec").prop('checked')) {
                namespace.passwordGenerator.specs = true;
            } else {
                namespace.passwordGenerator.specs = false;
            }
            namespace.passwordGenerator.generatePassword(namespace.passwordGenerator.prevLen);
        });
    }

    // check password strength start here
    function scorePassword(pass) {
        var score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        var letters = new Object();
        for (var i=0; i<pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        var variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        variationCount = 0;
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score);
    }

    function checkPassStrength(pass) {
        var score = scorePassword(pass);
        if (score > 80)
            return "strong";
        if (score > 60)
            return "good";
        if (score >= 30)
            return "weak";

        return "very weak";
    }

    $(document).ready(function() {
        $("#modalPass").on("keypress keyup keydown", function() {
            var pass = $(this).val();
            $("#strength_human").text(checkPassStrength(pass));
            $("#strength_score").text(scorePassword(pass));
        });
    });
    // check password strength end here

})(JJBPBOT);

$(document).ready(function () {
    JJBPBOT.main();
});